# Category

---

## 카테고리 생성

```plain
[POST] /categories
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
			"id": "<number, positive integer>",
			"name": "<string, length 1 to 64>",
		}
	}
	```

#### 409

- 이미 존재하는 이름
	```json
	{
		"status": "fail",
		"data": {
			"title": "Duplicated name"
		}
	}
	```

---

## 모든 카테고리

```plain
[GET] /categories
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
|page[order]|_'asc' \| 'desc'_|'asc' 또는 'desc'이며 기본 'desc'입니다|
|page[index]|_number_|양의 정수이며 기본 0입니다|
|name|_string_|최소 1자 최대 64자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|
|partialName|_string_|최소 1자 최대 64자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, positive integer>",
			"name": "<string, length 1 to 64>",
		}[]
	}
	```

#### 400

- 이미 존재하는 이름 조건
	```json
	{
		"status": "fail",
		"data": {
			"title": "Duplicated name condition"
		}
	}
	```


---

## 카테고리

```plain
[GET] /categories/:id
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
			"id": "<number, positive integer>",
			"name": "<string, length 1 to 64>",
		}
	}
	```