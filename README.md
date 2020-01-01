# 환경변수

## 환경 변수 목록

API 서버를 실행시키기 위해서는 필수적으로 아래의 환경변수를 정의해야합니다.
정의되지 않은 경우, 예외가 발생합니다.


| 이름                  | 설명                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------- |
| JWT_SECRET            | 액세스토큰 생성할 때 서명(signing)을 위한 비밀 값. 개발중에는 기억하기 쉬운 값으로 설정하자 |
| AWS_ACCESS_KEY_ID     | AWS 액세스 키                                                                               |
| AWS_SECRET_ACCESS_KEY | AWS 액세스 비밀 키                                                                          |

## 환경 변수 설정

`env/` 디렉토리에 환경변수용 파일 `.env`을 작성하면 서버 실행시 환경변수가 바인딩됩니다.
`env/.env.sample` 파일에 기본 템플릿이 작성되어있습니다.


# 개발용 CDN

이미지 등 정적 데이터 조회를 위해서는 아래 도메인에 경로를 붙여 요청합니다.

https://dibfgrk6qpg5k.cloudfront.net

# API Doc.

**바로가기**

- [health-check](#health-check): 서버 접속 테스트를 위한 API
- [auth](#auth): 자격 증명과 관련된 API
- [accounts](#accounts) 사용자에 종속적인 자원에 접근하는 API
- [travel-rooms](#travel-rooms) 여행방 자원에 접근하는 API

## health-check

### 엔트포인트

```http
GET /ping
```

### 설명

서버가 응답을 할 수 있는 상태인지 확인합니다. 응답 값에 의미 없는 문자열이 포함됩니다.

### 응답 예시

```json
pong
```

## auth

### 엔트포인트

```http
POST /auth/oauth/login
```

### 설명

OAuth2 서비스(카카오로 로그인)를 제공하는 리소스 서버를 통해 로그인하여 액세스토큰과 리프레시토큰을 발급받습니다.

### 요청 헤더

| 키           | 값               | 설명 |
| ------------ | ---------------- | ---- |
| Content-Type | application/json |      |

### 요청 바디

| 이름        | 타입   | 설명                                          | 제약 조건                                                                       | 필수 여부 |
| ----------- | ------ | --------------------------------------------- | ------------------------------------------------------------------------------- | --------- |
| oauthServer | string | OAuth를 지원하는 리소스 서버를 나타냅니다.    | [지원하는 리소스 서버 리스트](#oauth-resource-servers) 중 하나의 값을 가집니다. | 필수      |
| oauthId     | string | 리소스 서버에서 발급하는 사용자의 고유 아이디 |                                                                                 | 필수      |
| oauthToken  | string | 리소스 서버에서 발급하는 액세스 토큰          |                                                                                 | 필수      |

### 응답 바디

| 이름         | 타입    | 설명                                                                                                                                                                      | 제약 조건 | 필수 여부 |
| ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------- |
| token        | string  | 서버 자원에 대한 접근 권한을 입증하기 위한 액세스 토큰. 이 값을 `Authorization` 헤더에 포함시켜야 요청자가 로그인한 사용자임을 서버가 알 수 있다. 유효기간이 비교적 짧다. |           | 필수      |
| payload.exp  | integer | 응답 바디의 token의 만료 일시. Time since epoch을 초단위로 나타낸 값이다.                                                                                                 |           | 필수      |
| payload.sub  | string  | 가치여행 API 서버에서 생성한 요청자의 고유 아이디.                                                                                                                        |           | 필수      |
| refreshToken | string  | 유효기간이 짧은 token(액세스토큰)을 재발급하기위해 사용되는 리프레시토큰.                                                                                                 |           | 필수      |

### 응답 예시

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Nzc1OTUyNjksInN1YiI6ImI3M2ViYTRlLWQzNzQtNDAyNC1hOTliLTA0ZjZmN2QwNzMyOSJ9.bsKH6U2bKSmWuiIdBTdkgdnv3QDg4DFGnGmLRDJCwLY",
  "payload": {
    "exp": 1577595269,
    "sub": "b73eba4e-d374-4024-a99b-04f6f7d07329"
  },
  "refreshToken": "33e5505df96946059ac590a4140388e1"
}
```

### 엔트포인트

```http
GET /auth/refresh
```

### 설명

가치여행 API 서버에서 발급한 리프레시토큰으로 새로운 액세스토큰을 발급받습니다.

### 요청 헤더

| 키   | 값           | 설명                                           |
| ---- | ------------ | ---------------------------------------------- |
| x-rt | 리프레시토큰 | 가치여행 API 서버로부터 발급받은 리프레시 토큰 |

### 응답 예시

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Nzc1OTUzNjcsInN1YiI6ImI3M2ViYTRlLWQzNzQtNDAyNC1hOTliLTA0ZjZmN2QwNzMyOSJ9.m-zBp4qf0fOsmXvjn1utv8w-EatbAkxQImHJQDeGZOQ",
  "payload": {
    "exp": 1577595367,
    "sub": "b73eba4e-d374-4024-a99b-04f6f7d07329"
  },
  "refreshToken": "33e5505df96946059ac590a4140388e1"
}
```

## accounts

### 엔트포인트

```http
GET /me/profile
```

### 설명

자신의 프로필을 조회합니다.

### 요청 헤더

| 키            | 값                                                                                               | 설명 |
| ------------- | ------------------------------------------------------------------------------------------------ | ---- |
| Authorization | [토큰 유형](#토큰-유형)과 가치여행 API서버에서 발급한 액세스토큰을 공백(' ')으로 이어붙인 문자열 |      |

### 응답 바디

| 이름             | 타입    | 설명                                                                                 | 제약 조건 | 필수 여부 |
| ---------------- | ------- | ------------------------------------------------------------------------------------ | --------- | --------- |
| id               | string  | 가치여행 API서버에서 생성한 사용자의 고유 아이디                                     |           | 필수      |
| name             | string  | 사용자의 닉네임. OAuth로 로그인한 경우 리소스서버에 설정된 값이 디폴트임.            |           | 필수      |
| profileImagePath | string? | 사용자의 프로필 사진의 url. OAuth로 로그인한 경우 리소스서버에 설정된 값이 디폴트임. |           | 선택      |
| createdAt        | date    | 계정 생성 일시. OAuth로 로그인한 경우 최초로 로그인한 일시임.                        |           | 필수      |
| statusMessage    | string? | 상태 메시지. 설정하지 않은 경우 null.                                                |           | 선택      |

### 응답 예시

```json
{
  "id": "b73eba4e-d374-4024-a99b-04f6f7d07329",
  "name": "김예지",
  "profileImagePath": "http://k.kakaocdn.net/dn/cTh9DU/btqAq8c1skY/qTs4K8Ujh9oUffurqrTGPK/img_640x640.jpg",
  "createdAt": "2019-12-23T15:57:29.344Z",
  "statusMessage": null
}
```

### 엔트포인트

```http
GET /me/travel-rooms
```

### 설명

자신이 속해있는 여행방 리스트를 조회합니다. 각 여행방에는 멤버와 나라 리스트가 포함됩니다.

### 요청 헤더

| 키            | 값                                                                                               | 설명 |
| ------------- | ------------------------------------------------------------------------------------------------ | ---- |
| Authorization | [토큰 유형](#토큰-유형)과 가치여행 API서버에서 발급한 액세스토큰을 공백(' ')으로 이어붙인 문자열 |      |

### 응답 바디

| 이름                        | 타입    | 설명                                                 | 제약 조건 | 필수 여부 |
| --------------------------- | ------- | ---------------------------------------------------- | --------- | --------- |
| id                          | string  | 가치여행 API서버에서 생성한 여행방의 고유 아이디.    |           | 필수      |
| name                        | string  | 여행방의 이름.                                       |           | 필수      |
| startDate                   | date?   | 여행 시작 일시.                                      |           | 선택      |
| endDate                     | date?   | 여행 마지막 일시.                                    |           | 선택      |
| coverImagePath              | string? | 여행방 커버 이미지 url.                              |           | 선택      |
| createdDate                 | date    | 여행방 생성 일시.                                    |           | 필수      |
| members[i].id               | string  | 가치여행 API서버에서 생성한 각 멤버의 고유 아이디.   |           | 필수      |
| members[i].name             | string  | 각 멤버의 닉네임.                                    |           | 필수      |
| members[i].statusMessage    | string? | 각 멤버의 상태 메시지.                               |           | 선택      |
| members[i].profileImagePath | string? | 각 멤버의 프로필 이미지 url.                         |           | 선택      |
| members[i].createdAt        | date    | 각 멤버의 계정 생성 일시.                            |           | 필수      |
| countries[i].code           | string  | 각 국가의 코드. 부록의 [국가 코드](#국가-코드) 참고. |           | 필수      |
| countries[i].nameInKorean   | string  | 각 국가의 한국 이름. (예: 대한민국)                  |           | 필수      |
| countries[i].nameInEnglish  | string  | 각 국가의 영어 이름. (예: Korea)                     |           | 필수      |
| countries[i].emoji          | string? | 각 국가의 국기 이모지. (예: 🇰🇷)                      |           | 선택      |

### 응답 예시

```json
[
  {
    "id": "86ec949a-c1fb-4090-9ec9-c89853c7cf33",
    "name": "좋은 여행2",
    "startDate": null,
    "endDate": null,
    "coverImagePath": "travel-room/cover-image/86ec949a-c1fb-4090-9ec9-c89853c7cf33.jpeg",
    "createdDate": "2019-12-25T05:17:42.696Z",
    "members": [
      {
        "id": "b73eba4e-d374-4024-a99b-04f6f7d07329",
        "name": "김예지",
        "statusMessage": null,
        "profileImagePath": "http://k.kakaocdn.net/dn/cTh9DU/btqAq8c1skY/qTs4K8Ujh9oUffurqrTGPK/img_640x640.jpg",
        "createdAt": "2019-12-23T15:57:29.344Z"
      }
    ],
    "countries": [
      {
        "code": "KR",
        "nameInKorean": "대한민국",
        "nameInEnglish": "Korea",
        "emoji": "🇰🇷"
      },
      {
        "code": "US",
        "nameInKorean": "미국",
        "nameInEnglish": "America",
        "emoji": "🇺🇸"
      }
    ]
  },
  {
    "id": "b3c99e80-b1a3-418a-9d09-9e1bdb0a5c91",
    "name": "좋은 여행2",
    "startDate": null,
    "endDate": "2023-06-07T14:34:08.700Z",
    "coverImagePath": null,
    "createdDate": "2019-12-25T05:41:46.830Z",
    "members": [
      {
        "id": "b73eba4e-d374-4024-a99b-04f6f7d07329",
        "name": "김예지",
        "statusMessage": null,
        "profileImagePath": "http://k.kakaocdn.net/dn/cTh9DU/btqAq8c1skY/qTs4K8Ujh9oUffurqrTGPK/img_640x640.jpg",
        "createdAt": "2019-12-23T15:57:29.344Z"
      }
    ],
    "countries": []
  }
]
```

## travel-rooms

### 엔트포인트

```http
POST /travel-rooms
```

### 설명

새 여행방을 개설합니다.

### 요청 헤더

| 키            | 값                                                                                               | 설명 |
| ------------- | ------------------------------------------------------------------------------------------------ | ---- |
| Authorization | [토큰 유형](#토큰-유형)과 가치여행 API서버에서 발급한 액세스토큰을 공백(' ')으로 이어붙인 문자열 |      |
| Content-Type  | application/json                                                                                 |      |

### 요청 바디

| 이름      | 타입      | 설명           | 제약 조건              | 필수 여부 |
| --------- | --------- | -------------- | ---------------------- | --------- |
| name      | string    | 여행방 이름    |                        | 필수      |
| startDate | date?     | 여행 시작 일시 |                        | 선택      |
| endDate   | date?     | 여행 종료 일시 |                        | 선택      |
| countries | Country[] | 국가 리스트    | 배열 요소 갯수는 0이상 | 필수      |

### 응답 바디

| 이름           | 타입   | 설명                                              | 제약 조건 | 필수 여부 |
| -------------- | ------ | ------------------------------------------------- | --------- | --------- |
| id             | string | 가치여행 API서버에서 생성한 여행방의 고유 아이디. |           | 필수      |
| name           | string | 요청시 전달한 여행방의 이름.                      |           | 필수      |
| startDate      | date?  | 요청시 선택적으로 전달한 여행 시작 일시.          |           | 선택      |
| endDate        | date?  | 요청시 선택적으로 전달한 여행 종료 일시.          |           | 선택      |
| coverImagePath | date?  | 여행방 커버 이미지. 여행방 최초 생성시에는 null.  |           | 선택      |
| createdDate    | date   | 여행방 생성 일시                                  |           | 필수      |

### 응답 예시

```json
{
  "id": "1c26b13b-9649-427e-b68a-aeadcb27662d",
  "name": "미국, 일본, 호주",
  "startDate": null,
  "endDate": null,
  "coverImagePath": null,
  "createdDate": "2019-12-29T05:40:59.799Z"
}
```

### 엔트포인트

```http
GET /travel-rooms/cover-image/upload-url
```

### 설명

여행방 커버 이미지 업로드를 위한 url을 조회합니다.
조회되는 url은 AWS에서 제공하는 Signing url로, 유효기간이 존재합니다. 현재는 30초.
성공적으로 url을 조회한 경우, 해당 url로 이미지를 전송하면 해당 여행방의 커버 이미지가 변경됩니다.
이미지를 업로드할 것이 확실한 시점에 이 API를 호출하는 것이 좋습니다.

### 요청 헤더

| 키            | 값                                                                                               | 설명 |
| ------------- | ------------------------------------------------------------------------------------------------ | ---- |
| Authorization | [토큰 유형](#토큰-유형)과 가치여행 API서버에서 발급한 액세스토큰을 공백(' ')으로 이어붙인 문자열 |      |

### 쿼리 파라미터

| 파라미터     | 값                                        | 설명                                                         | 필수 여부 |
| ------------ | ----------------------------------------- | ------------------------------------------------------------ | --------- |
| travelRoomId | 커버 이미지를 변경할 여행방의 고유 아이디 |                                                              | 필수      |
| format       | 업로드할 이미지의 형식.                   | [지원하는 이미지 형식](#이미지-형식) 중 하나를 전달해야한다. | 필수      |

### 응답 바디

| 이름      | 타입   | 설명                                                 | 제약 조건       | 필수 여부 |
| --------- | ------ | ---------------------------------------------------- | --------------- | --------- |
| signedUrl | string | 여행방 커버 이미지를 전송하여 업로드 할 수 있는 url. | 만료기한이 존재 | 필수      |

### 응답 예시

```json
{
  "signedUrl": "https://travel-together2.s3.amazonaws.com/travel-room/cover-image/86ec949a-c1fb-4090-9ec9-c89853c7cf33.jpeg?Content-Type=image%2Fjpeg&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5KWQOYF7SUMU33GN%2F20191229%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20191229T055140Z&X-Amz-Expires=300&X-Amz-Signature=6cb1b6d24809792d2e4783e3479072ca5f3978c50053ef00b05a2157421f55cb&X-Amz-SignedHeaders=host"
}
```

# 부록

## Enums

### Country

KR

## OAuth Resource Servers

- kakao

## 토큰 유형

- Bearer

## 국가 코드

서버와 클라이언트 통신 과정에서 사용되는 모든 국가코드는 [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)에 명시되어있어야 한다.

## 지원하는 이미지 형식

- jpg
- jpeg
- gif
- png
- tiff
- webp
