# user

<img src="https://img.shields.io/badge/%7F%20%20GET%20%20%20%7F-/user-e1e1e1?labelColor=46C487&style=flat-square" height="25"/>

> 사용자 조회

- request

  none

- response

  ```json
  {
    "status": 200,
    "data": {
      "user": {
        "image": "https://imageurl.com",
        "emailVerified": null,
        "name": "홍길동",
        "email": "hong@gmail.com"
      },
      "profile": {
        "createdAt": "2024-01-29T14:37:32.662Z",
        "agreeTerms": {
          "marketing": false,
          "service": true,
          "privacy": true,
          "age": true
        },
        "userName": "유저 이름",
        "updatedAt": "2024-01-29T14:46:27.273Z"
      }
    }
  }
  ```

<br/>

<img src="https://img.shields.io/badge/%7F%20%20POST%20%7F-/user/profile-e1e1e1?labelColor=219BFD&style=flat-square" height="25"/>

> 회원 가입 직후, 사용자 이름 및 이용약관 정보 등록

- request

  `@body`

  ```json
  {
    userName: string;
    agreeTerms:{
      age: boolean;
      service: boolean;
      privacy: boolean;
      marketing?: boolean
      };
  }
  ```

- response

  ```json
  {
    "status": 200,
    "data": {
      "agreeTerms": {
        "age": true,
        "service": true,
        "privacy": true,
        "marketing": false
      },
      "userName": "홍길동",
      "createdAt": "2024-01-30T01:44:44.417Z",
      "updatedAt": "2024-01-30T01:44:44.417Z"
    }
  }
  ```

<br/>

<img src="https://img.shields.io/badge/%7F%20%20Patch%20%20%20%7F-/user/profile-e1e1e1?labelColor=F89331&style=flat-square" height="25"/>

> 사용자 정보 수정

- request

  `@body`

  ```json
  {
    "userName": "김철수"
  }
  ```

- response

  ```json
  {
    "status": 200,
    "data": {
      "updatedAt": "2024-01-30T01:45:51.114Z",
      "userName": "김철수"
    }
  }
  ```

<br />

<br />

# post

<img src="https://img.shields.io/badge/%7F%20%20GET%20%20%20%7F-/post-e1e1e1?labelColor=46C487&style=flat-square" height="25"/>

> 사용자 포스팅 가져오기

<br/>

<img src="https://img.shields.io/badge/%7F%20%20POST%20%7F-/post-e1e1e1?labelColor=219BFD&style=flat-square" height="25"/>

> 사용자 포스팅 작성

- request

  `@body`

  ```json
  {
    title: string;
    content: string;
    template: string;
  }
  ```

<br/>

<img src="https://img.shields.io/badge/%7F%20%20GET%20%20%20%7F-/post/filter-e1e1e1?labelColor=46C487&style=flat-square" height="25"/>

> 필터를 사용하여 사용자 요청

- request

  `@body`

  ```json
  {
    // yyyy-mm-dd
    startDate: string;
    endDate: string;
  }
  ```
