# fileController.md - 기본 기능
- /main URL에서 사용될 파일 수정 및 실행과 관련된 함수들 작성
    + /main의 하위 URL에서 실행되는 기능은 다음과 같음: 파일 리스트 표시, 파일의 추가/삭제, 파일 수정, 레이아웃 생성, ...

- 함수 getAllContacts: 파일 리스트 표시를 위해 파일 메타데이터를 DB에서 불러오는 함수

- 함수 addContactForm: 파일을 생성할 때, 관련 페이지 생성(GET 접근)

- 함수 createContact: 파일을 생성할 때, 사용자 입력값 받음(POST 접근)

- 함수 getContact
