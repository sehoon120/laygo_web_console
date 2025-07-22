# fileRoute.md - 기본 기능 /수정중
- /main 아래의 페이지들에 대한 route. /main 아래의 페이지들에서는 각 유저별로 파일을 업로드/삭제/편집이 가능하며, generate 후 레이아웃을 확인하는 것도 가능하다.
    + 사용 기술: express.Router, multer(multimedia 관리)
    + 관리하는 페이지(/main아래의 subURL): / -> 기본 화면, /add -> 파일 업로드 관련, /(userID) -> ㄹㅇㄴㅁㄹ, /(userID)/edit , /(userID)/edit/logs 

- 연결 controller: controllers/fileController로부터 객체 받아와 이용
    + getAllContacts, createContact, getContact, updateContact, deleteContact, addContactForm, editFile, saveFile, getLogFile => 수정 필요

- 각 페이지별 설명
    + /: get method로 접근 시 getAllContacts controller 함수 객체 호출해 처리
    + /add: get method로 접근 시 addContactForm controller 함수 객체 호출해 처리 / post method로 접근 시 createContact 함수 객체 호출해 처리
- pseudocode
```
# mongoose 사용 설정
mongoose = require('mongoose')

#fileSchema 객체: schema 정의(mongoose 이용)
fileSchema = mongoose.Schema({
    username: {attribute type: string, 필수},
    password: {attribute type: string, 필수},
    email: {attribute type: string, 필수, unique(반드시 그래야 하나? 생각필요)},
})

#model 객체 생성
user = mongoose.model('user', userSchema)
```
