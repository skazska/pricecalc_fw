#lang racket

(require web-server/formlets
          "calcdb.rkt")

(provide app-formlet unit-formlet tpl-formlet)

(define-syntax-rule (hidden-f f)
  (to-number 
   (to-string 
    (required 
     (hidden (string->bytes/utf-8 (number->string f)))))))

(define-syntax-rule (string-f f)
  (to-string
   (required
    (text-input #:value (string->bytes/utf-8 f)))))

(define-syntax-rule (string-f-ta f c r)
  (to-string
   (required
    (textarea-input #:value (string->bytes/utf-8 f) #:cols c #:rows r))))

(define-syntax-rule (number-f f)
  (to-number
   (to-string
    (required
     (text-input #:value (string->bytes/utf-8(number->string f)))))))

(define-syntax-rule (boolean-f-cb f)
  (to-boolean
   (default #"off" (checkbox #"on" f))))   

(define-syntax-rule (item-f a-formlet a-caption a-class)
  `(div ([class ,a-class]) (span ([class "caption"]) ,a-caption)
       (span ([class "value"]) ,a-formlet)))
  

;(app-formlet app?) returns formlet for given app
(define (app-formlet an-app)
  (formlet* (#%# 
             {=>* (hidden-f (app-id an-app)) id}
             (item-f {=>* (string-f (app-nm an-app)) nm} "Имя" "stdField") 
             ) (values id nm)))

;(tpl-formlet tpl?) returns formlet for given tpl
(define (tpl-formlet a-tpl)
  (formlet* (#%# 
             {=>* (hidden-f (tpl-id a-tpl)) id}
             (item-f {=>* (string-f (tpl-nm a-tpl)) nm} "Имя" "stdField") 
             (item-f {=>* (string-f-ta (tpl-content a-tpl)  60 10) content} 
                     "Шаблон" "stdField") 
             ) (values id nm content)))

;(unit-formlet unit?) returns formlet for given unit
(define (unit-formlet a-unit) 
  (formlet* (#%# {=>* (hidden-f (unit-id a-unit)) id}
                (item-f {=>* (string-f (unit-nm a-unit)) nm} "ID" "stdField")
                (item-f {=>* (string-f (unit-descr a-unit)) descr} "Название" "stdField") 
                (item-f {=>* (boolean-f-cb (unit-is_opt a-unit)) is_opt} "Необязательн." "stdField")
                (item-f {=>* (number-f (unit-height a-unit)) height} "Высота" "stdField")
                (item-f {=>* (string-f (unit-content a-unit)) content} "Урл.контента" "stdField")
                (item-f {=>* (string-f (unit-init a-unit)) init} "Имя функ. иниц." "stdField")) 
           (values id nm descr is_opt height content init))) 
