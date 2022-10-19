# Medias

---

## 미디어 생성

```plain
[POST] /medias
```

### Request

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Query

|key|type|description|
|---|---|---|
|isUserMedia|_boolean_|불리언입니다|

#### Body

|key|type|description|
|---|---|---|
|(number)|media|gif, jpg(jpeg), png, mp4, mov의 형식의 미디어입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, positive number>",
			"name": "<string, hex encoded and length 128>",
			"type": "<string, length 3>",
			"userId": "<number, positive number>",
			"isImage": "<boolean>"
		}
	}
	```

#### 400

- 미디어 개수 부족
	```json
		{
			"status": "fail",
			"data": {
				"title": "Lack of media"
			}
		}
	```

- 필드 이름 형식 불일치
	```json
		{
			"status": "fail",
			"data": {
				"title": "Invalid field name"
			}
		}
	```

- 존재하지 않는 대상 유저
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid userId"
		}
	}
	```

- 존재하지 않는 대상 게시글
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid postId"
		}
	}
	```

- 게시글 미디어 개수 초과
	```json
	{
		"status": "fail",
		"data": {
			"title": "Too many medias"
		}
	}
	```

#### 401

- 요청하는 유저와 대상 유저 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Unauthorized user"
		}
	}
	```

#### 413

- 미디어 크기 초과
	```json
	{
		"status": "fail",
		"data": {
			"title": "Too large media size"
		}
	}
	```

#### 422

- 미디어 형식 불일치
	```json
		{
			"status": "fail",
			"data": {
				"title": "Invalid media type"
			}
		}
	```

---

## 모든 미디어

```plain
[GET] /medias
```

### Request

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Query

|key|type|description|
|---|---|---|
|page[size]|_number_|자연수이며 기본 50입니다|
|page[index]|_number_|양의 정수이며 기본 0입니다|
|page[order]|_'asc' \| 'desc'_|'asc' 또는 'desc'이며 기본 'desc'입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, positive number>",
			"name": "<string, hex encoded and length 128>",
			"type": "<string, length 3>",
			"userId": "<number, positive number>",
			"isImage": "<boolean>"
		}[]
	}
	```

---

## 미디어

```plain
[GET] /medias/:id
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
			"id": "<number, positive number>",
			"name": "<string, hex encoded and length 128>",
			"type": "<string, length 3>",
			"userId": "<number, positive number>",
			"isImage": "<boolean>"
		}
	}
	```

---

## 미디어 삭제

```plain
[DELETE] /medias/:id
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

#### 401

- 요청하는 유저와 작성자 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Unauthorized user"
		}
	}
	```