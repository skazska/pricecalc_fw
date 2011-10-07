#lang racket  

(require
 web-server/http web-server/page web-server/servlet web-server/formlets
 (planet dherman/json:3:0)
 "calcdb.rkt"
 "calcformlets.rkt")

(provide interface-version start)
(define interface-version 'v2)

(define-syntax-rule (map_s f l)
  (if (empty? l)  '()   (map f l)))

;;Starter 
;(start request?) ->  can-be-response?
(define (start req)
  (render-main-page req  (init-calc! DB_PATH)))

;;structure "action" consist of handler function, action activator text
;(action ((handler caption))
; handler   : (request? formals...)
; caption   : string?
(struct action (handler caption))

;;;common page renderer
;;function renders html for page with given title, 
;; consisting of sequence of page blocks generated using generator and data
;; from list of "block" structures, and transports ireq (which should be 
;; initial request to page) to block generators
;(render-page request? string? (listof block?) request? 
;             [#:head-gen #:top-gen #:bottom-gen]) -> xexpr?  
; #:head-gen : (string? . -> . xexpr?)
; #:top-gen : (string? . -> . xexpr?)
; #:bottom-gen : ( . -> . xexpr?)
(define (render-page embed/url title blocks 
                     #:head-gen [head-gen render-head]
                     #:top-gen  [top-gen  render-top]
                     #:bottom-gen [bottom-gen render-bottom])
     (response/xexpr
      `(html
        ,(head-gen title)
        (body ,(top-gen title) 
              ,@(map_s (lambda (block) (block embed/url)) blocks) 
              ,(bottom-gen)))))

;;default page header generetor function
;(render-head string?) -> xexpr
(define (render-head title) `(head (title ,title)))
;;default page top zone generetor function
;(render-top string?) -> xexpr
(define (render-top title) `(h1 ,title))
;;default page bottom zone generetor function
;(render-bottom) -> xexpr
;(define (render-bottom req) `(div (br) ,(url->string (request-uri req))))
(define (render-bottom) `(div (br) "Подвал"))

;;;common link renderer
;;generates xexpr for html link using embed/url with given link handler, 
;; link text and attributes
;(render-link embed/url (request? -> can-be-response?) string? xexpr?) -> xexpr?
(define (render-link embed/url handler text attrs)
  `(a ([href ,(embed/url handler)] ,@attrs) ,text))

;;;common list of item renderer
;;function generates html representing list of items with links
;; to given handlers  
;; items represented by texts of items retured by text-getter functions 
;(render-item-list embed/url (request? item -> can-be-response?) 
;                  (item -> string?) (listof item) 
;                  [#:container #:item-container]) -> xexpr?
; item : any/c?
(define (render-item-list embed/url items text-getter actions
                          #:container [container 'ul] 
                          #:item-container [item-container 'li])
  (local [(define (call-render-list-item item)
            (local [(define (call-render-action action)
                      (render-link embed/url 
                                   (lambda (req) ((action-handler action) req item))
                                   (action-caption action)
                                   (list `(class "item_action"))))
                    ]
              `(,item-container ,(render-link embed/url
                                              (lambda (req)((action-handler (car actions)) req item))
                                              (text-getter item)
                                              (list `(class "linked_item") `(style "")))
                                ,@(map_s call-render-action (cdr actions)))))
          ]
    `(,container ,@(map_s call-render-list-item items))))

;;Rendering action links panel
;(render-calc-panel embed/url (listof actions?)) -> xexpr?
(define (render-action-panel embed/url actions)
  `(div ([class "panel"])
        ,@(map_s (lambda (an-action)  
                   (render-link embed/url (action-handler an-action) (action-caption an-action)
                              (list `(class "panel_action"))))
                 actions)))

;;Rendering main (calc) page consisting of list of applications
;(render-main-page request? calc?) -> xexpr?       
(define/page (render-main-page a-calc)
  (local [
          ;handlers
          (define (new-handler req)
            (render-app-page 
             req (app a-calc -1 "Введите имя нового приложения")))
          ;blocks
          (define (panel-block embed/url)
            (render-action-panel embed/url 
                                 (list (action new-handler "Новое приложение"))))
          (define (list-block embed/url)
            (render-item-list embed/url (calc-apps a-calc) app-nm
                              (list (action render-app-page "Открыть"))))
          ]            
    (render-page embed/url "Настройка калькулятора"
                 (list panel-block list-block))))
;;;Applications
;;Rendering app page consisting of App data edit form and lists of units and templates
;(render-app-page request? app?) -> xexpr?       
(define/page (render-app-page an-app)
  (local [
          ;handlers
          (define (save-handler req)
            (define-values (id nm) (formlet-process (app-formlet an-app) req))              
            (render-app-page (redirect/get) 
                             (set-app! (app-calc an-app) (car id) (car nm))))
          (define (go-main-handler req)
            (render-main-page req (app-calc an-app)))
          (define (new-unit-handler req)
            (render-unit-page 
             req (unit an-app -1 "Unit name" "название" #t 0 "content uri" "init function name")))
          (define (new-tpl-handler req)
            (render-tpl-page 
             req (tpl an-app -1 "template id" "{}")))
          ;blocks 
          (define (panel-block embed/url)
            (render-action-panel embed/url 
                                 (list (action go-main-handler "Назад к списку"))))
          (define (form-block embed/url)
            (render-app-form embed/url an-app save-handler ))
          (define (unit-list-panel embed/url)
            (render-action-panel embed/url 
                                 (list (action new-unit-handler "Новый модуль"))))
          (define (unit-list-block embed/url)
            (render-item-list embed/url (app-units an-app) unit-descr
                              (list (action render-unit-page "Открыть"))))            
          (define (tpl-list-panel embed/url)
            (render-action-panel embed/url 
                                 (list (action new-tpl-handler "Новый шаблон"))))
          (define (tpl-list-block embed/url)
            (render-item-list embed/url (app-tpls an-app) tpl-nm
                              (list (action render-tpl-page "Открыть"))))            
          ]
    (render-page embed/url 
                 (string-append "Настройка калькулятора - Приложение: " (app-nm an-app))
                 (list panel-block form-block unit-list-panel unit-list-block
                       tpl-list-panel tpl-list-block))))

;;Render app data edit form
;(render-app-form embed/url app?) -> xexpr?
(define (render-app-form embed/url an-app save-handler)
  `(div ([class "form"])
        (form ([action ,(embed/url save-handler)][method "POST"])
              (span ,@(formlet-display (app-formlet an-app) ))
              (span (input ([type "submit"][value "Сохранить"]))))));)
  
;;;Units
;;Rendering Unit page, consisting of unit's params edit form and list of data items
;(render-unit-page request? unit?) -> xexpr?
(define/page (render-unit-page a-unit)
  (local [
          ;handlers
          (define (save-handler req)
            (define-values (id nm descr is_opt height content init) 
              (formlet-process (unit-formlet a-unit) req))              
            (render-unit-page (redirect/get) 
                              (set-unit! (unit-app a-unit) (car id) (car nm)
                                         (car descr) #:is_opt (car is_opt) 
                                         #:height (car height) #:content (car content)
                                         #:init (car init))))
          (define (go-app-handler req)
            (render-app-page req (unit-app a-unit)))
          (define (new-num-data-handler req)
            (render-unitdata-page 
             req (unitdata a-unit -1 "data id" "NUM" 0)))
          (define (new-txt-data-handler req)
            (render-unitdata-page 
             req (unitdata a-unit -1 "data id" "TEXT" "")))
          (define (new-num-data-handler req)
            (render-unitdata-page 
             req (unitdata a-unit -1 "data id" "SPR" "")))
          ;blocks
          (define (form-block embed/url)
            (render-unit-form embed/url a-unit save-handler))
          (define (panel-block embed/url)
            (render-action-panel embed/url 
                                 (list (action go-app-handler "Назад к Приложению"))))
          (define (data-list-panel embed/url)
            (render-action-panel embed/url 
                                 (list (action new-num-data-handler "Новое число")
                                       (action new-txt-data-handler "Новый текст")
                                       (action new-spr-data-handler "Новый справочник"))))
          (define (data-list-block embed/url)
            (render-item-list embed/url (unit-data a-unit) unitdata-descr
                              (list (action render-unitdata-page "Открыть"))))            
          ]
  (render-page embed/url 
               (string-append "Настройка калькулятора Модуль " 
                              (unit-nm a-unit) " Приложения " 
                              (app-nm (unit-app a-unit)))
               (list panel-block form-block data-list-panel data-list-block 
                     ;list-block
                     ) 
               )))
  
;;Rendering unit edit form with fields [id nm descr is_opt height content init]
;(render-unit-form embed/url unit?) -> xexpr?
(define (render-unit-form embed/url a-unit post-handler)
  `(div ([class "form"]) 
        (form ([action ,(embed/url post-handler)][method "POST"])
              ,@(formlet-display (unit-formlet a-unit))
              (input ([type "submit"][value "Сохранить"])))))


;;UnitData 
(define/page (render-unitdata-page a-data)
  (local [
          ;handlers
          (define (save-handler req)
            (define-values (id nm value)
              (cond [(eqv? (data-tp a-data) "NUM")
                     (formlet-process (unitdata-num-formlet a-tpl) req)]
                    [(eqv? (data-tp a-data) "TEXT")
                     (formlet-process (unitdata-txt-formlet a-tpl) req)]
                    [(eqv? (data-tp a-data) "SPR")
                     (formlet-process (unitdata-spr-formlet a-tpl) req)]))              
            (render-unitdata-page (redirect/get) 
                              (set-unitdata! (unitdata-unit a-data) (car id) (car nm)
                                             (car value))))
          (define (go-app-handler req)
            (render-app-page req (tpl-app a-tpl)))
          
          ;blocks
          (define (form-block embed/url)
            (render-tpl-form embed/url a-tpl save-handler))
          (define (panel-block embed/url)
            (render-action-panel embed/url 
                                 (list (action go-app-handler "Назад к Приложению"))))
          ]
  (render-page embed/url 
               (string-append "Настройка калькулятора Шаблон " 
                              (tpl-nm a-tpl) " Приложения " 
                              (app-nm (tpl-app a-tpl)))
               (list panel-block form-block 
                     ;list-block
                     ) 
               )))
          


;;Templates
;;Rendering template page consisitng of data form representing template
;; with fields: template id and template text
(define/page (render-tpl-page a-tpl)
  (local [
          ;handlers
          (define (save-handler req)
            (define-values (id nm content) 
              (formlet-process (tpl-formlet a-tpl) req))              
            (render-tpl-page (redirect/get) 
                              (set-tpl! (tpl-app a-tpl) (car id) (car nm) (car content))))
          (define (go-app-handler req)
            (render-app-page req (tpl-app a-tpl)))
          
          ;blocks
          (define (form-block embed/url)
            (render-tpl-form embed/url a-tpl save-handler))
          (define (panel-block embed/url)
            (render-action-panel embed/url 
                                 (list (action go-app-handler "Назад к Приложению"))))
          ]
  (render-page embed/url 
               (string-append "Настройка калькулятора Шаблон " 
                              (tpl-nm a-tpl) " Приложения " 
                              (app-nm (tpl-app a-tpl)))
               (list panel-block form-block 
                     ;list-block
                     ) 
               )))
;;Rendering tpl edit form with fields [id nm content]
;(render-tpl-form embed/url tpl?) -> xexpr?
(define (render-tpl-form embed/url a-tpl post-handler)
  `(div ([class "form"]) 
        (form ([action ,(embed/url post-handler)][method "POST"])
              ,@(formlet-display (tpl-formlet a-tpl))
              (input ([type "submit"][value "Сохранить"])))))
  


(require web-server/servlet-env)
(serve/servlet start
               #:launch-browser? #f
               #:quit? #t
;               #:stateless #f
;               #:listen-ip #f
               #:port 8080
;               #:extra-files-paths
;               (list (build-path your-path-here "htdocs"))
               #:servlet-path
               "/servlets/cms.rkt")