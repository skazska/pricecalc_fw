#lang web-server

(require
 web-server/formlets 
 web-server/page
 (planet dherman/json:3:0)
 "calcdb.rkt")

(provide interface-version stuffer start)

(define interface-version 'stateless)
(define stuffer
 (stuffer-chain
  serialize-stuffer
  (md5-stuffer (build-path (find-system-path 'home-dir) ".urls"))))

(define (rq-app req)
  (local [(define b (bindings-assq #"app" (request-bindings/raw req)))]
  (match b 
    [(? binding:form?) 
     (string->number (bytes->string/utf-8 (binding:form-value b)))]
    [_ DEFAULT_APP])))


(define (start req)
  (render-form req (rq-app req)))


(define ff (formlet (#%# ,{input-string . => . app}
                         ,{input-string . => . val})
                    (values app val)))

(define (render-form req app)
  (page 
   (response/xexpr
    `(html (body (form 
                  ([action ,(embed/url render-app-data)]) 
                  ,@(formlet-display ff)
                  (input ([type "submit"]))))))))

(define (render-app-data req)  
  (define-values (app val)
    (formlet-process ff req))
  (response/jsexpr
   (make-hasheq (list (cons "app" app) (cons "val" val))) ) )



(define (response/jsexpr
         jsexpr
         #:code [code 200] 
         #:message [message #"Okay"]
         #:seconds [seconds (current-seconds)]
         #:mime-type [mime-type #"application/json; charset=utf-8"]
         #:cookies [cooks empty]
         #:headers [hdrs empty]
         #:preamble [preamble #""])
  (response
   code message seconds mime-type 
   ; rfc2109 also recommends some cache-control stuff here for cookies
   (append hdrs (map cookie->header cooks))
   (λ (out)
     (write-bytes preamble out)
     (write-json jsexpr out))))



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
               "/servlets/test.rkt")
