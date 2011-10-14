#lang racket
;;data model for new calculator
(require (prefix-in sqlite: (planet jaymccarthy/sqlite))
         )

(provide DEFAULT_APP DB_PATH
         calc init-calc! calc-apps
         (struct-out app) set-app! app-tpls app-units 
         (struct-out unit) set-unit! unit-data UD_NUM UD_TXT UD_SPR
         (struct-out tpl) set-tpl!
         (struct-out unitdata) set-unitdata! unitdata-coldefs unitdata-descr
         unitdata-gen-tab unitdata-gen-tab-sql
         (struct-out coldef) set-coldef! coldef-descr
         map_rest)

(define DB_PATH (build-path (current-directory)
                "calcdb.sqlite"))
(define DEFAULT_APP 0)
;;;SQLs

;;Initializing database 
(define CREATE_APP_SQL 
  "CREATE TABLE app(id INTEGER PRIMARY KEY, nm TEXT)")
(define CREATE_UNIT_SQL 
  "CREATE TABLE unit(id INTEGER PRIMARY KEY, appid INTEGER, nm TEXT, descr TEXT, is_opt INTEGER, height INTEGER, content TEXT, init TEXT)")
(define CREATE_UNIT_DATA_SQL
  "CREATE TABLE unit_data(id INTEGER PRIMARY KEY, unitid INTEGER, nm TEXT, tp INTEGER, numval NUMERIC, textval TEXT, spr TEXT)")
(define CREATE_TPL_SQL
  "CREATE TABLE tpl(id INTEGER PRIMARY KEY, appid INTEGER, nm TEXT, content TEXT)")
(define CREATE_COLDEF_SQL
  "CREATE TABLE coldef(id INTEGER PRIMARY KEY, unitdataid INTEGER, nm TEXT, tp TEXT)")
;;Work with app
(define GET_APPS_SQL
  "SELECT id, nm FROM app LIMIT ? OFFSET ?")
(define INS_APP_SQL
  "INSERT INTO app(nm) VALUES (?)")
(define UPD_APP_SQL
  "UPDATE app SET nm = ? WHERE id = ?")
;;Work with tpl
(define GET_APP_TPLS_SQL
  "SELECT id, nm, content FROM tpl WHERE appid = ? LIMIT ? OFFSET ?")
(define INS_TPL_SQL
  "INSERT INTO tpl (appid, nm, content) VALUES (?, ?, ?)")
(define UPD_TPL_SQL
  "UPDATE tpl SET nm = ?, content = ? WHERE id = ?")
;;Work with unit
(define GET_APP_UNITS_SQL
  "SELECT id, nm, descr, is_opt, height, content, init FROM unit WHERE appid = ? LIMIT ? OFFSET ?")
(define INS_UNIT_SQL
  "INSERT INTO unit (appid, nm, descr, is_opt, height, content, init) VALUES (?, ?, ?, ?, ?, ?, ?)")
(define UPD_UNIT_SQL
  "UPDATE unit SET nm = ?, descr = ?, is_opt = ?, height = ?, content = ?, init = ? WHERE id = ?")

;;Work with unitdata
(define UD_NUM 0) (define UD_TXT 1) (define UD_SPR 2) 
(define GET_APP_UNITDATA_SQL
  "SELECT id, nm, tp, numval, textval, spr FROM unit_data WHERE unitid = ? LIMIT ? OFFSET ?")
(define INS_UNITDATA_NUM_SQL
  "INSERT INTO unit_data (unitid, nm, tp, numval) VALUES (?, ?, ?, ?)")
(define INS_UNITDATA_TEXT_SQL
  "INSERT INTO unit_data (unitid, nm, tp, textval) VALUES (?, ?, ?, ?)")
(define INS_UNITDATA_SPR_SQL
  "INSERT INTO unit_data (unitid, nm, tp, spr) VALUES (?, ?, ?, ?)")
(define UPD_UNITDATA_NUM_SQL
  "UPDATE unit_data SET nm = ?, numval = ? WHERE id = ?")
(define UPD_UNITDATA_TEXT_SQL
  "UPDATE unit_data SET nm = ?, textval = ? WHERE id = ?")
(define UPD_UNITDATA_SPR_SQL
  "UPDATE unit_data SET nm = ? spr = ? WHERE id = ?")

;;Work with COLDEF
(define GET_UNITDATA_COLDEF_SQL
  "SELECT id, nm, tp FROM coldef WHERE unitdataid = ? LIMIT ? OFFSET ?")
(define INS_COLDEF_SQL
  "INSERT INTO coldef (unitdataid, nm, tp) VALUES (?, ?, ?)")
(define UPD_COLDEF_SQL
  "UPDATE coldef SET nm = ?, tp = ? WHERE id = ?")

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
    ;;Column definition : nm - column name, tp - data type: 0-NUMERIC,1-TEXT
    (sqlite:exec/ignore db CREATE_COLDEF_SQL)
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

;;Templates represents GUI elements of app
;; template has a name identifiyng it for gui and 
;; content - a JSON expression representing a html 
;; with placers
(struct tpl (app id nm content))
;app : app? - app ref
;id : integer? - db id
;nm : string? - name
;content : string? - template

;;Modify template: insert/update data into tpl with given name and content 
;(set-tpl! an-app id nm content) -> tpl?
;an-app : app?
;id : integer?
;nm : string?
;content : string?
(define (set-tpl! an-app id nm content)
  (cond [(< id 0) (tpl an-app 
                       (sqlite:insert (calc-db (app-calc an-app)) INS_TPL_SQL 
                                      (app-id an-app) nm content) 
                       nm content)]
        [else (sqlite:exec/ignore (calc-db (app-calc an-app)) UPD_TPL_SQL nm content id)
              (tpl an-app id nm content)]))

;;returns tpl structure from given calc and vector of field vals
;(vector->tpl app? vector?) -> tpl?
(define (vector->tpl an-app x)
  (tpl an-app (vector-ref x 0) (vector-ref x 1) (vector-ref x 2)))

;;returns list of tpl structure from given app
;(app-tpls app? [#:limit #:offset]) -> (listof tpl?)
; limit : integer?
; offset: integer?
(define (app-tpls an-app #:limit [limit 100] #:offset [offset 0])
  (let ([rows (sqlite:select 
              (calc-db (app-calc an-app)) GET_APP_TPLS_SQL 
              (app-id an-app) limit offset)]) 
    (map_rest (lambda (x) (vector->tpl an-app x)) rows)))


;;Application consist of units - units of calculation
;; each unit has same structure but different content
(struct unit (app id nm descr is_opt height content init))
; id : integer? app : app? nm : string? descr : sctring? is_opt : boolean? height : integer? content : string? init : string?

;;Modify unit: insert/update data into unit with given field vals for given app 
;(set-unit! app? integer? string? string? [#:is_opt #:height #:content #:init]) -> unit?
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

;;returns list of unit structure from given app
;(app-units app? [#:limit #:offset]) -> (listof unit?)
; limit : integer?
; offset: integer?
(define (app-units an-app #:limit [limit 100] #:offset [offset 0])
  (let ([rows (sqlite:select 
              (calc-db (app-calc an-app)) GET_APP_UNITS_SQL 
              (app-id an-app) limit offset)]) 
    (map_rest (lambda (x) (vector->unit an-app x)) rows)))

;;unfold unit's db
;(unit-db unit?) -> sqlite:db?
(define (unit-db a-unit)
  (calc-db (app-calc (unit-app a-unit))))


;;unit-data structure
(struct unitdata (unit id nm tp value))
; unit : unit?  id : integer? nm : string? tp : string? value : any/c?

;;short description of unitdata element
;(unitdata-descr unitdata?) -> string?
(define (unitdata-descr a-data)
  (string-append (unitdata-nm a-data) 
                 (cond [(eqv? (unitdata-tp a-data) UD_NUM) " (Чисо)"]
                       [(eqv? (unitdata-tp a-data) UD_TXT) " (Строка)"]
                       [(eqv? (unitdata-tp a-data) UD_SPR) " (Справочник)"])))

;;unfold unitdata's db
;(unitdata-db unitdata?) -> sqlite:db?
(define (unitdata-db a-data)
  (calc-db (app-calc (unit-app (unitdata-unit a-data)))))

;;Modify unitdata: insert/update data into  with given name and content 
;(set-unitdata! a-unit id nm tp val) -> ?
;an-app : app?
;id : integer?
;nm : string?
;content : string?
(define (set-unitdata! a-unit id nm tp value)
  (cond [(< id 0) 
         (unitdata a-unit
                   (cond [(eqv? tp UD_NUM) 
                          (sqlite:insert (unit-db a-unit) INS_UNITDATA_NUM_SQL 
                                         (unit-id a-unit) nm UD_NUM value)]
                         [(eqv? tp UD_TXT) 
                          (sqlite:insert (unit-db a-unit) INS_UNITDATA_TEXT_SQL 
                                         (unit-id a-unit) nm UD_TXT value)]
                         [(eqv? tp UD_SPR) 
                          (sqlite:insert (unit-db a-unit) INS_UNITDATA_SPR_SQL 
                                         (unit-id a-unit) nm UD_SPR value)])
                   nm tp value)]
        [else 
         (cond [(eqv? tp UD_NUM)
                (sqlite:exec/ignore (unit-db a-unit) UPD_UNITDATA_NUM_SQL nm value id)]
               [(eqv? tp UD_TXT)
                (sqlite:exec/ignore (unit-db a-unit) UPD_UNITDATA_TEXT_SQL nm value id)]
               [(eqv? tp UD_SPR)
                (sqlite:exec/ignore (unit-db a-unit) UPD_UNITDATA_SPR_SQL nm value id)])
              (unitdata a-unit id nm tp value)]))


;;returns unitdata structure from given unit and vector of field vals
;; value field assigned depending on type (tp)
;(vector->unitdata unit? vector?) -> unitdata?
(define (vector->unitdata a-unit x)
  (unitdata a-unit  (vector-ref x 0) (vector-ref x 1) (vector-ref x 2)
            (cond [(eqv? (vector-ref x 2) UD_NUM)  (vector-ref x 3)]
                  [(eqv? (vector-ref x 2) UD_TXT)  (vector-ref x 4)]
                  [(eqv? (vector-ref x 2) UD_SPR)  (vector-ref x 5)])))

;;Each unit has content-data
(define (unit-data a-unit #:limit [limit 100] #:offset [offset 0])
  (let ([rows (sqlite:select (unit-db a-unit) GET_APP_UNITDATA_SQL 
                            (unit-id a-unit) limit offset)])
  (map_rest (lambda (x) (vector->unitdata a-unit x)) rows)))

;;
(define (coldef->string a-coldef [a-delim " "])
    (string-append (coldef-nm a-coldef) a-delim 
                   (cond [(eqv? (coldef-tp a-coldef) UD_NUM) "NUMERIC"]
                         [(eqv? (coldef-tp a-coldef) UD_TXT) "TEXT"]))) 


;;table unitdata db table generation 
;;function creates new table with name like udt[unitdataid]_[vernum] 
;; with fields depending on coldefs 
;(unitdata-gen-tab unitdata?) -> unitdata? 
(define (unitdata-gen-tab a-data)
  (sqlite:exec/ignore (unitdata-gen-tab-sql a-data)))

(define (unitdata-gen-tab-sql a-data) 
  (define version (+ 1 (car (cdr (regexp-split #rx"_+" (unitdata-value a-data))))))
  (string-append "CREATE TABLE udt" (number->string (unitdata-id a-data)) "_"
                 (number->string version) "( ID INTEGER PRIMARY KEY, "
                 (string-join (map coldef->string (unitdata-coldefs a-data)) ",")
                 ")"))


;;;column definition of unit's spr data
(struct coldef (unitdata id nm tp))
; unitdata : unitdata? id : integer? nm : string? tp : string?

;;description of column definition
(define (coldef-descr a-coldef)
  (coldef->string a-coldef " : ")) 

;;Modify coldef: insert/update data into coldef with given name and content 
;(set-coldef! unitdata? integer? string? integer?) -> coldef?
(define (set-coldef! a-data id nm tp)
  (cond [(< id 0) (coldef a-data 
                       (sqlite:insert (unitdata-db a-data) INS_COLDEF_SQL 
                                      (unitdata-id a-data) nm tp) 
                       nm tp)]
        [else (sqlite:exec/ignore (unitdata-db a-data) UPD_COLDEF_SQL nm tp id)
              (coldef a-data id nm tp)]))
;;returns tpl structure from given calc and vector of field vals
;(vector->coldef unitdata? vector?) -> coldef?
(define (vector->coldef a-data x)
  (coldef a-data (vector-ref x 0) (vector-ref x 1) (vector-ref x 2)))
;;list of uditdata's spr column definitions....
;(unitdata-spr-cols unitdata?) -> (listof coldef?)
(define (unitdata-coldefs a-data  #:limit [limit 100] #:offset [offset 0])
  (let ([rows (sqlite:select (unitdata-db a-data) GET_UNITDATA_COLDEF_SQL 
                            (unitdata-id a-data) limit offset)])
  (map_rest (lambda (x) (vector->coldef a-data x)) rows)))












;;returns data list of unitdata
;(unitdata-spr unit? string?) -> (listof hashtable?)
(define (unit-data-spr a-unit spr-name)
  (local [;;returns list of pairs each of which have car from keylist 
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

   
            
  