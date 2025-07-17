# fileController.md - 기본 기능
- /main URL에서 사용될 파일 수정 및 실행과 관련된 함수들 작성
    + /main의 하위 URL에서 실행되는 기능은 다음과 같음: 파일 리스트 표시, 파일의 추가/삭제, 파일 수정, 레이아웃 생성, ...

- 함수 getAllContacts: 파일 리스트 표시를 위해 파일 메타데이터를 DB에서 불러오는 함수

- 함수 addContactForm: 파일을 생성할 때, 관련 페이지 생성(GET 접근)

- 함수 createContact: 파일을 생성할 때, 사용자 입력값 받음(POST 접근)

- 함수 getContact: 파일 이름 받아 파일 찾아서 해당 페이지 render

- 함수 updateContact: 파일 경로 변경. Name, type, path를 새로 request 받아 이를 변환. Directory에 대해서도 경로 변경이 가능하므로, 이 경우 하위 파일들에 대해서도 메타데이터를 변환시켜주어야 한다.

- 함수 deleteContact: 파일 삭제.

- 함수 editFile: 파일 수정. 수정할 File type이 directory이면 해당 directory의 페이지로 redirect, 일반 file이면 파일 내용 수정 페이지 렌더링

- 함수 saveFile: 파일 저장. file id와 수정할 내용(content) 받아 file에 저장

- 함수 generateLayout: 레이아웃 생성. Laygo script file을 실행시켜 yaml 파일로 저장. Log 저장 => 이때 모든 정보를 뽑기 위해 Laygo 수정 필요. Laygo에 feature 추가 필요

- 함수 getLogFile: log file 읽어 반환
