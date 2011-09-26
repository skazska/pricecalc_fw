#lang web-server

(require
 web-server/formlets 
 web-server/page
 (planet dherman/json:3:0)
 "calcdb.rkt")

;(provide interface-version stuffer start)
(provide interface-version start)
(define interface-version 'v2)
;(define interface-version 'stateless)
;(define stuffer
; (stuffer-chain
;  serialize-stuffer
;  (md5-stuffer (build-path (find-system-path 'home-dir) ".urls"))))

;;Starter 
;(start request?) ->  can-be-response?
(define (start req)
  (render-main-page req  (init-calc! DB_PATH)))


;;abstract page renderer
;(block (generator data))
; generator : (embed/url data? . -> . xexpr?)
; data      : any/c
(struct block (generator data))
;(render-page request? string? (listof block?) 
;             [#:head-gen #:top-gen #:bottom-gen]) -> xexpr?  
; #:head-gen : (string? . -> . xexpr?)
; #:top-gen : (string? . -> . xexpr?)
; #:bottom-gen : ( . -> . xexpr?)
(define (render-page req title blocks 
                     #:head-gen [head-gen render-head]
                     #:top-gen  [top-gen  render-top]
                     #:bottom-gen [bottom-gen render-bottom])
  (local [(define (render-blocks embed/url blocks)
            (local [(define (call-block-generator a-block)
                      ((block-generator a-block) embed/url (block-data a-block)))]
              (if (empty? blocks) 
                  (list `(p "empty")) 
                  (map call-block-generator blocks))))]
    (page
     (response/xexpr
      `(html
        ,(head-gen title)
        (body ,(top-gen title) 
              ,@(render-blocks embed/url blocks) 
              ,(bottom-gen)))))))
;(render-head string?) -> xexpr
(define (render-head title) `(head (title ,title)))
;(render-top string?) -> xexpr
(define (render-top title) `(h1 ,title))
;(render-bottom) -> xexpr
(define (render-bottom) `(div (br) "the end"))

;;abstract list of item renderer
;(render-item-list embed/url (request? item -> can-be-response?) 
;                  (item -> string?) (listof item) 
;                  [#:container #:item-container]) -> xexpr?
; item : any/c?
(define (render-item-list embed/url page-generator text-getter items
                          #:container [container 'ul] 
                          #:item-container [item-container 'li])
  ;;abstract list item renderer
  ;(render-list-item embed/url item (request? item -> can-be-response?)
  ;                  string? [#:container]
  (local [(define (render-list-item embed/url item page-generator text container)
            (local [(define (go-render-page req)
                      (page-generator req item))]
              `(,container (a ([href ,(embed/url go-render-page)]) ,text))))
          (define (call-render-list-item item)
            (render-list-item embed/url item page-generator (text-getter item)
                              item-container))]
    `(,container ,@(if (empty? items) 
                       (list `(span "empty")) 
                       (map call-render-list-item items)))))


;;Rendering main (calc) page consisting of list of applications
;(render-main-page request? calc?) -> xexpr?       
(define (render-main-page req a-calc)
  (render-page req "Настройка калькулятора" 
               (list (block render-calc-panel a-calc)
                     (block render-app-list a-calc)
                     )))
;;Rendering calc panel action links
(define (page-redirect generator req param)
  (generator (redirect/get) param))
;app formlet
(define add-app-formlet
  (formlet (#%# ,{=> input-string nm}) nm))
;(render-calc-panel embed/url calc?) -> xexpr?
(define (render-calc-panel embed/url a-calc)
  (local [(define (add-app-handler req)
            (new-app! a-calc (formlet-process add-app-formlet req))
            (page-redirect render-main-page req a-calc))]
  `(div ([class "calc_panel"])
        (form ([action ,(embed/url add-app-handler)])
              (span ,@(formlet-display add-app-formlet ))
              (span (input ([type "submit"][value "Add new application"])))))))
;;;Applications

;;Rendering application list of calc
;(render-app-list embed/url calc?) -> xexpr?
(define (render-app-list embed/url a-calc)
  (render-item-list embed/url render-app-page app-nm (calc-apps a-calc)))

;;Rendering app page consisting of list of units and list of templates
;(render-app-page request? app?) -> xexpr?       
(define (render-app-page req an-app)
  (render-page req 
               (string-append "Настройка калькулятора - Приложение" (app-nm an-app))
               (list (block render-unit-list an-app)
                     ;(block render-tpl-list an-app)
                     )))

;;;Units
                
;;Rendering unit list of app
;(render-unit-list embed/url app?) -> xexpr?
(define (render-unit-list embed/url an-app)
  (render-item-list embed/url render-unit-page unit-descr (app-units an-app)))

;;Rendering Unit page, consisting of unit's params edit form and list of data items
;(render-unit-page request? unit?) -> xexpr?
(define (render-unit-page req a-unit)
  (render-page req 
               (string-append "Настройка калькулятора - Приложение" 
                              (app-nm (unit-app a-unit)))
               (list (block render-unit-form a-unit)
                     ;(block render-data-list a-unit)
                     )))
  
;;Rendering unit edit form with fields [id nm descr is_opt height content init]
;(unit-formlet unit?) returns formlet for given unit
(define (unit-formlet a-unit) 
  (formlet (#%# ,{=> (to-number (to-string (hidden (unit-id a-unit)))) id}
                ,{=> (to-string (required (text-input #:value (unit-nm a-unit)))) nm}
                ,{=> (to-string (required (text-input #:value (unit-descr a-unit)))) descr}
                ,{=> (to-boolean 
                      (to-string (required (text-input #:value (unit-is_opt a-unit)))))
                     is_opt}
                ,{=> (to-number 
                      (to-string (required (text-input #:value (unit-height a-unit))))) 
                     height}
                ,{=> (to-string (required (text-input #:value (unit-content a-unit)))) 
                     content}
                ,{=> (to-string (required (text-input #:value (unit-init a-unit)))) init})
           (unit id nm descr is_opt height content init))) 
;(render-unit-form embed/url unit?) -> xexpr?
(define (render-unit-form embed/url a-unit)
  `(div ([class "unit_form"]) 
        (form ([href (embed/url post_handle)])
              ,@(formlet-display (unit-formlet a-unit))
              (input ([type "submit"])))))

;;Templates
;;Rendering template list of app
;(render-tpl-list embed/url app?) -> xexpr?
;(define (render-tpl-list embed/url an-app)
;  (render-item-list embed/url render-tpl-page tpl-nm (app-templates an-app)))




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