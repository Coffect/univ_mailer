# Coffect 대학인증 메일링 서버

univcert apI가 서비스를 중단해서 어쩔수 없이 직접 메일링 서버를 만들었다.

학교 도메인 이메일이 사용가능하고, 해당 메일이 유효하다면(졸업자 제외) 해당 학교 학생인것으로 간주하고, 재학생인증을 구현했다.

### 현재 구현한 기능
- 메일 전송, 코드 생성 및 검증
- 코드 유효성 검토, 에러핸들링
  
### 문제
- 메일 주소가 유효하지 않을때 nodemailer에서는 검증을 못하고 일단 보낸다. 일단 프론트에서 정규식을 활용해 유효성검토하고 추후 개선하는 방향으로,,

### TODO
- 아마존 SES, 네이버웍스등으로 실제 도메인을 구입해 sender를 수정
- redis사용 메일 유효성 검토
