# Medias

---

## 미디어 단일 생성

```plain
[POST] /medias
```

### Request

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Body

|key|type|description|
|---|---|---|
||media|gif, jpg(jpeg), png, mp4, mov의 형식의 미디어이며, 단일 필드입니다|

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
			"isImage": "<boolean>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>"
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

- 미디어 갯수 초과
	```json
	{
		"status": "fail",
		"data": {
			"title": "Too many media"
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

#### 415

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

## 미디어 다중 생성

```plain
[POST] /medias/many
```

### Request

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Body

|key|type|description|
|---|---|---|
||media|gif, jpg(jpeg), png, mp4, mov의 형식의 미디어이며, 다중 필드입니다|

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
			"isImage": "<boolean>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>"
		}[]
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

- 미디어 갯수 초과
	```json
	{
		"status": "fail",
		"data": {
			"title": "Too many media"
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

#### 415

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
			"isImage": "<boolean>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>"
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
			"isImage": "<boolean>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>"
		}
	}
	```

---

## 미디어 단일 삭제

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

- 요청하는 유저와 업로더 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Unauthorized user"
		}
	}
	```

---

## 미디어 다중 삭제

```plain
[DELETE] /medias/many
```

### Request

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

### Body

|key|type|description|
|---|---|---|
|mediaIds|number[]|자연수로 이루어진 배열입니다|

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

- 미디어 개수 부족
	```json
		{
			"status": "fail",
			"data": {
				"title": "Lack of mediaIds"
			}
		}
	```

- 미디어 개수 불일치
	```json
		{
			"status": "fail",
			"data": {
				"title": "Invalid mediaIds"
			}
		}
	```

#### 401

- 요청하는 유저와 업로더 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Unauthorized user"
		}
	}
	```