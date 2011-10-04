#lang racket
;;data model for new calculator
(require (prefix-in sqlite: (planet jaymccarthy/sqlite))
         )

(provide DEFAULT_APP DB_PATH
         calc init-calc! calc-apps
         (struct-out app) set-app! app-units set-unit!
         (struct-out unit) unit-data 
         unitdata unit-data-spr
         map_rest)

(define DB_PATH (build-path (current-directory)
                "calcdb1.sqlite"))
(define DEFAULT_APP 0)
;;;SQLs

;;Initializing database 
(define CREATE_APP_SQL 
  "CREATE TABLE app(id INTEGER PRIMARY KEY, nm TEXT)")
(define CREATE_UNIT_SQL 
  "CREATE TABLE unit(id INTEGER PRIMARY KEY, appid INTEGER, nm TEXT, descr TEXT, is_opt INTEGER, height INTEGER, content TEXT, init TEXT)")
(define CREATE_UNIT_DATA_SQL
  "CREATE TABLE unit_data(id INTEGER PRIMARY KEY, unitid INTEGER, tp INTEGER, numval NUMERIC, textval TEXT, spr TEXT)")
(define CREATE_TPL_SQL
  "CREATE TABLE tpl(id INTEGER PRIMARY KEY, appid INTEGER, content TEXT)")
;;Work with app
(define GET_APPS_SQL
  "SELECT id, nm FROM app LIMIT ? OFFSET ?")
(define INS_APP_SQL
  "INSERT INTO app(nm) VALUES (?)")
(define UPD_APP_SQL
  "UPDATE app SET nm = ? WHERE id = ?")
;;Work with unit
(define GET_APP_UNITS_SQL
  "SELECT id, nm, descr, is_opt, height, content, init FROM unit WHERE appid = ? LIMIT ? OFFSET ?")
(define INS_UNIT_SQL
  "INSERT INTO unit (appid, nm, descr, is_opt, height, content, init) VALUES (?, ?, ?, ?, ?, ?, ?)")
(define UPD_UNIT_SQL
  "UPDATE unit SET nm = ?, descr = ?, is_opt = ?, height = ?, content = ?, init = ? WHERE id = ?")

;;Work with unitdata
(define GET_APP_UNITDATA_SQL
  "SELECT id, tp, numval, textval, spr FROM unit_data WHERE unitid = ? LIMIT ? OFFSET ?")
(define INS_UNITDATA_NUM_SQL
  "INSERT INTO unit(unitid, tp, numval) VALUES (?, 'NUM', ?)")
(define INS_UNITDATA_TEXT_SQL
  "INSERT INTO unit(unitid, tp, textval) VALUES (?, 'TEXT', ?)")
(define INS_UNITDATA_SPR_SQL
  "INSERT INTO unit(unitid, tp, spr) VALUES (?, 'SPR', ?)")

;;map including empty list
(define-syntax-rule (map_rest f l)
  (if (empty? l)
        '()
        (map f (rest l))))

;;Calculator - an abstract db container 
(struct calc (db))
; db : sqlite:db?

;;Init calc creates sqlite db and initializes db structure if not exists
;(init_calc!) -> calc?
(define (init-calc! path)
  (define db (sqlite:open path))
  (define the-calc (calc db)) 
  (with-handlers ([exn? void])
    ;;Prepare new db
    ;;Applications
    (sqlite:exec/ignore db CREATE_APP_SQL)
    ;;Units : content - unit's plate content html, init - unit's init procedure name, 
    ;; height - unit plate's heifht in pixels, is_opt - "not an ovligatory unit" flag
    (sqlite:exec/ignore db CREATE_UNIT_SQL)
    ;;Unit Data : tp - data type: 0-NUMERIC,1-TEXT,2-TABLE, numval/textval - vaue fields, 
    ;; spr - table name
    (sqlite:exec/ignore db CREATE_UNIT_DATA_SQL)
    ;;Templates : content - template content in JSON format 
    (sqlite:exec/ignore db CREATE_TPL_SQL)
    )
  the-calc)

;;Calculator's application list
;; TO DO : field mapping? check?
;(calc-apps a-calc [#:limit #:offset]) -> (listof app?)
; a-calc : calc?
; limit : integer?  = 100
; offset : integer? = 0
(define (calc-apps a-calc #:limit [limit 100] #:offset [offset 0])
  (let ([rows (sqlite:select (calc-db a-calc) GET_APPS_SQL 
                              limit offset)])  
    (map_rest (lambda (x) (vector->app a-calc x)) rows)))

;;Application - the root of hierarchy
;; distinguish logicaly consistent and independent calculators.
(struct app (calc id nm))
; calc : calc?
; id   : integer?
; nm   : string?

;;Modify application: insert/update data into app with given name 
;(set-app! a-calc id nm) -> app?
;a-calc : calc?
;id : integer?
;nm : string?
(define (set-app! a-calc id nm)
  (cond [(< id 0) (app a-calc (sqlite:insert (calc-db a-calc) INS_APP_SQL nm) nm)]
        [else (sqlite:exec/ignore (calc-db a-calc) UPD_APP_SQL nm id)
              (app a-calc id nm)]))

;;returns app structure from given calc and vector of field vals
;(vector->app calc? vector?) -> app?
(define (vector->app a-calc x)
  (app a-calc (vector-ref x 0) (vector-ref x 1)))

;;returns list of unit structure from given app
;(app-units app? [#:limit #:offset]) -> (listof unit?)
; limit : integer?
; offset: integer?
(define (app-units an-app #:limit [limit 100] #:offset [offset 0])
  (let ([rows (sqlite:select 
              (calc-db (app-calc an-app)) GET_APP_UNITS_SQL 
              (app-id an-app) limit offset)]) 
    (map_rest (lambda (x) (vector->unit an-app x)) rows)))


;;Application consist of units - units of calculation
;; each unit has same structure but different content
(struct unit (app id nm descr is_opt height content init))
; id : integer? app : app? nm : string? descr : sctring? is_opt : boolean? height : integer? content : string? init : string?

;;Modify unit: insert/update data into unit with given field vals for given app 
;(add-app! calc? string? string? [#:is_opt #:height #:content #:init]) -> app?
; is_opt : boolean?
; height : integer?
; content: string?
; init   : string?
(define (set-unit! an-app id nm descr #:is_opt [is_opt #t] #:height [height 100] 
                       #:content [content ""] #:init [init ""])

  (cond [(< id 0) 
         (unit an-app 
               (sqlite:insert (calc-db (app-calc an-app)) INS_UNIT_SQL 
                              (app-id an-app) nm descr (if is_opt 1 0) 
                              height content init) 
               nm descr is_opt height content init)]
        [else (sqlite:exec/ignore (calc-db (app-calc an-app)) UPD_UNIT_SQL 
                              nm descr (if is_opt 1 0) height content init id) 
              (unit an-app id nm descr is_opt height content init)]))
;;returns unit structure from given app and vector of field vals
;(vector->unit app? vector?) -> unit?
(define (vector->unit an-app x)
  (unit an-app (vector-ref x 0) (vector-ref x 1) (vector-ref x 2) 
        (not(eqv? (vector-ref x 3) 0)) (vector-ref x 4) (vector-ref x 5) (vector-ref x 6)))

;;Each unit has content-data
(define (unit-data a-unit #:limit [limit 100] #:offset [offset 0])
  (let ([rows (sqlite:select (unit-db) GET_APP_UNITDATA_SQL 
                            (unit-id a-unit) limit offset)])
  (map (lambda (x) (vector->unitdata a-unit x))
       (rest rows))))

;;unfold unit's db
;(unit-db unit?) -> sqlite:db?
(define (unit-db a-unit)
  (calc-db (app-calc (unit-app a-unit))))

;;unit-data structure
(struct unitdata (unit id tp val))
; id : integer? unit : unit? type : string? value : any/c?

;;returns unitdata structure from given unit and vector of field vals
;; value field assigned depending on type (tp)
;(vector->unitdata unit? vector?) -> unitdata?
(define (vector->unitdata a-unit x)
  (unitdata a-unit  (vector-ref x 0) (vector-ref x 1)
            (cond [(eqv? (vector-ref x 1) "NUM")  (vector-ref x 2)]
                  [(eqv? (vector-ref x 1) "TEXT")  (vector-ref x 3)]
                  [(eqv? (vector-ref x 1) "SPR")  (unit-data-spr 
                                                   a-unit (vector-ref x 3))])))
  
;;returns data list of unitdata
;(unitdata-spr unit? string?) -> (listof hashtable?)
(define (unit-data-spr a-unit spr-name)
  (local [;;returns list if pairs each of which have car from keylist 
          ;; and cdr from value list at same position
          ;(pairlist (listof datum/c?) (listof datum/c?)) -> (listof pair?)
          (define (pairlist keylist vallist)
            (if (or (null? keylist) (null? vallist)) 
                '();end of one of lists reached
                (cons (cons (car keylist) (car vallist)) 
                      (pairlist (cdr keylist) (cdr vallist))))) 
          ;;make hash, representing data row record from  two lists of values
          ;; representing field names and values
          (define (row->hash hd row)
            (make-hash (pairlist hd row)))
          (define rows (sqlite:select 
                        (unit-db a-unit) 
                        (string-append "select * from " spr-name)))]
    (if (not (empty rows))
        (map (lambda (x) (row->hash (vector->list (car rows)) (vector->list x)))
             (cdr rows))
        '())))

   
            
  