# app.md - 기본 기능
express 이용해 

# app.md - input/output
- 외부 express pkgs
    + express
    + express-session: session 관리용 middleware. Login 후 session 관리 위해 필요
    + method-override: PUT/DELETE method 사용 위한 package
    + cookie-parser: 쿠키 파싱 위함.
- 내부 file들
    + Files in DIR views: rendering 할 page들 정의되어 있음
    + Files in DIR public: 정적 파일 제공(현재 구조상에서는 .css file)
    + /config/dbConnect: MongoDB 연결

# pseudocode
- 사용할 외부 파일/함수들 import(require())
- express, db, view, 정적 파일(./public), method_override, request parsing(Bodypaser), cookie parsing 설정
