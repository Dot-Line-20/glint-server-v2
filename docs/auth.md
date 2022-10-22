# Auth

---

## 이메일 인증

```plain
[GET] /auth/email
```

### Request

#### Query

|key|type|description|
|---|---|---|
|verificationKey|string|hex로 인코딜된 길이 128의 문자열입니다|

### Response

#### 307

- 성공
	```json
	// 로그인 페이지로 리다이렉트됩니다
	```

#### 400

- 존재하지 않는 인증키
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid verificationKey"
		}
	}
	```

---

## 로그인

```plain
[POST] /auth/login
```

### Request

#### Body

|key|type|description|
|---|---|---|
|email|string|이메일 형식의 문자열입니다|
|password|string|플레인 텍스트 형식의 문자열입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"refreshToken": "<json web token, expires in 30 days>",
			"accessToken": "<json web token, expires in 1 hour>"
		}
	}
	```

#### 400

- 존재하지 않는 유저
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid email"
		}
	}
	```

- 비밀번호 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid password"
		}
	}
	```

- 이메일 인증이 안 된 유저
	```json
	{
		"status": "fail",
		"data": {
			"title": "Unverified email"
		}
	}
	```

---

## 토큰 재생성

```plain
[POST] /auth/token
```

### Request

#### Body

|key|type|description|
|---|---|---|
|refreshToken|string|json web token 형식의 문자열입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"refreshToken": "<json web token, expires in left days>",
			"accessToken": "<json web token, expires in 1 hour>"
		}
	}
	```

#### 400

- 토큰 형식 불일치 또는 존재하지 않는 유저
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid refreshToken"
		}
	}
	```