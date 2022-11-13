# Followers

---

## 팔로워 생성

```plain
[POST] /users/:userId/followers
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
|id|number|자연수인 숫자입니다|

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"userId": "<number, natural number>",
			"followingUserId": "<number, natural number>",
		}
	}
	```

#### 400

- 요청하는 유저와 유저 일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid user"
		}
	}
	```

#### 409

- 이미 팔로우한 유저
	```json
	{
		"status": "fail",
		"data": {
			"title": "Duplicated following"
		}
	}
	```

---

## 모든 팔로워

```plain
[GET] /users/:userId/followers
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
|id|number|자연수인 숫자입니다|

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Query

|key|type|description|
|---|---|---|
|page[size]|_number_|자연수이며 기본 50입니다|
|page[index]|_number_|양의 정수이며 기본 0입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"userId": "<number, natural number>",
			"followingUser": {
				"id": "<number, natural number>",
				"email": "<string, email format>",
				"name": "<string, length 1 to 64>",
				"birth": "<string, ISO 8601 Date format>",
				"media": {
					"id": "<number, natural number>",
					"name": "<string, hex encoded and length 128>",
					"type": "<string, length 3>",
					"userId": "<number, natural number>",
					"isImage": "<boolean>",
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}/* | null */,
				"createdAt": "<string, ISO 8601 Date and time in UTC format>"
			}
		}[]
	}
	```

---

## 팔로워 삭제

```plain
[DELETE] /users/:userId/followers/:userId
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
|id|number|자연수인 숫자입니다|

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": null
	}
	```

#### 400

- 팔로우 하지 않은 유저
	```json
	{
		"status": "fail",
		"data": {
			"title": "Not followed"
		}
	}
	```