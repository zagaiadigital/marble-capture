# Documentação: https://docs.worldlabs.ai/api
> Extraído por Archon Ingestor em 18/02/2026 11:36
> Modo: MÓDULO DE RECURSÃO (Site Completo)



---

## 🔗 Fonte: https://docs.worldlabs.ai/api

## [​](#quickstart) Quickstart

1

Get an API key

1

Sign in to the [World Labs Platform](https://platform.worldlabs.ai) with your Marble account.If you don’t have a Marble account, you’ll be prompted to create one.

2

Visit the [billing page](https://platform.worldlabs.ai/billing).Add a payment method to your account and then purchase some credits to get started.

3

Generate an API key from the [API keys page](https://platform.worldlabs.ai/api-keys).

Save your API key in a secure location and never share it with anyone.

2

Create your first world

To verify your development setup is working, we recommend creating a world from only a text prompt.You can also create a world from an image, multiple images of the same scene, or a video.

Iterate more quickly with `Marble 0.1-mini` (equivalent to Draft in Marble).This example uses `Marble 0.1-plus` by default for best quality. If you’re iterating or debugging, you can use `Marble 0.1-mini` for much faster (30-45s) and cheaper generations.To use it, add `"model": "Marble 0.1-mini"` to your request body.

* Text input
* Image input
* Multi-image input
* Video input

1

Make a `POST` request to the [`/marble/v1/worlds:generate`](/api/reference/worlds/generate) endpoint.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "Mystical Forest",
    "world_prompt": {
      "type": "text",
      "text_prompt": "A mystical forest with glowing mushrooms"
    }
  }'
```

This will return an Operation object.

Copy

```python
{
  "operation_id": "20bffbb1-4ba7-453f-a116-93eaw1a6843e",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z",
  "expires_at": "2025-01-15T11:30:00Z",
  "done": false,
  "error": null,
  "metadata": null,
  "response": null
}
```

2

Poll the [`/marble/v1/operations/{operation_id}`](/api/reference/operations/get) endpoint until the operation is done.

Copy

```python
curl -X GET 'https://api.worldlabs.ai/marble/v1/operations/20bffbb1-4ba7-453f-a116-93eaw1a6843e' \
  -H 'WLT-Api-Key: YOUR_API_KEY'
```

This will return an Operation object. If the operation is not done, it will return a `200` status code and the Operation object will have a `done` field set to `false`:

Copy

```python
{
  "operation_id": "20bffbb1-4ba7-453f-a116-93eaw1a6843e",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z",
  "expires_at": "2025-01-15T11:30:00Z",
  "done": false,
  "error": null,
  "metadata": {
    "progress": { "status": "IN_PROGRESS", "description": "World generation in progress" },
    "world_id": "dc2c65e4-68d3-4210-a01e-7a54cc9ded2a"
  },
  "response": null
}
```

World generation should take **about 5 minutes** to complete. Once the world is generated, the `done` field will be set to `true` and the `response` field will contain the generated World:

Copy

```python
{
  "operation_id": "20bffbb1-4ba7-453f-a116-93eab1a6843e",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:35:00Z",
  "expires_at": "2025-01-15T11:30:00Z",
  "done": true,
  "error": null,
  "metadata": {
    "progress": {
      "status": "SUCCEEDED",
      "description": "World generation completed successfully"
    },
    "world_id": "dc2c65e4-68d3-4210-a01e-7a54cc9ded2a"
  },
  "response": {
    "id": "dc2c65e4-68d3-4210-a01e-7a54cc9ded2a",
    "display_name": "",
    "tags": null,
    "world_marble_url": "https://marble.worldlabs.ai/world/dc2c65e4-68d3-4210-a01e-7a54cc9ded2a",
    "assets": {
      "caption": "The scene is a fantastical forest...",
      "thumbnail_url": "<thumbnail_url>",
      "splats": {
        "spz_urls": {
          "500k": "<500k_spz_url>",
          "100k": "<100k_spz_url>",
          "full_res": "<full_res_spz_url>"
        }
      },
      "mesh": {
        "collider_mesh_url": "<collider_mesh_url>"
      },
      "imagery": {
        "pano_url": "<pano_url>"
      }
    },
    "created_at": null,
    "updated_at": null,
    "permission": null,
    "world_prompt": null,
    "model": null
  }
}
```

The `response` field contains a snapshot of the World at the time the operation completed. This allows you to access the generated assets without making a separate API call. Note that some fields like `display_name`, `created_at`, `updated_at`, `world_prompt`, and `model` may be empty or null in this snapshot. Use the [`GET /marble/v1/worlds/{world_id}`](/api/reference/worlds/get) endpoint to fetch the complete, up-to-date world.

You can view the generated world in Marble at `https://marble.worldlabs.ai/world/{world_id}`.

3

(Optional) Get the latest world

If you need to fetch the most up-to-date version of the world later, use the `world_id` to retrieve it.

Request

Copy

```python
curl -X GET 'https://api.worldlabs.ai/marble/v1/worlds/dc2c65e4-68d3-4210-a01e-7a54cc9ded2a' \
  -H 'WLT-Api-Key: YOUR_API_KEY'
```

This returns the latest version of the world:

Copy

```python
{
  "world": {
    "id": "dc2c65e4-68d3-4210-a01e-7a54cc9ded2a",
    "display_name": "Mystical Forest",
    "tags": null,
    "world_marble_url": "https://marble.worldlabs.ai/world/dc2c65e4-68d3-4210-a01e-7a54cc9ded2a",
    "assets": {
      "caption": "The scene is a fantastical forest...",
      "thumbnail_url": "<thumbnail_url>",
      "splats": {
        "spz_urls": {
          "500k": "<500k_spz_url>",
          "full_res": "<full_res_spz_url>",
          "100k": "<100k_spz_url>"
        }
      },
      "mesh": {
        "collider_mesh_url": "<collider_mesh_url>"
      },
      "imagery": {
        "pano_url": "<pano_url>"
      }
    },
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:35:00Z",
    "permission": null,
    "world_prompt": {
      "type": "text",
      "text_prompt": "The scene is a fantastical forest..."
    },
    "model": "Marble 0.1-plus"
  }
}
```

The world object includes:

* `assets.splats.spz_urls`: 3D Gaussian splat files in SPZ format (100k, 500k, and full resolution)
* `assets.mesh.collider_mesh_url`: Collider mesh in GLB format
* `assets.imagery.pano_url`: Panorama image
* `assets.caption`: AI-generated description of the world
* `assets.thumbnail_url`: Thumbnail image for the world
* `world_prompt`: The prompt used to generate the world (may be recaptioned)
* `model`: The model used for generation

You can create a world from a single image using either a public URL or by uploading a local file.Recommended image formats: `jpg`, `jpeg`, `png`, `webp`.

* From URL
* From local file

If your image is already hosted at a public URL, you can reference it directly.

1

Make a `POST` request to the [`/marble/v1/worlds:generate`](/api/reference/worlds/generate) endpoint with your image URL.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "My Image World",
    "world_prompt": {
      "type": "image",
      "image_prompt": {
        "source": "uri",
        "uri": "https://example.com/my-image.jpg"
      },
      "text_prompt": "A beautiful landscape"
    }
  }'
```

This returns an Operation object. Poll the operation as shown in the text input example until `done` is `true`. The completed operation’s `response` field will contain the generated World.

To use a local image file, first upload it as a media asset, then reference it in your generation request.

1

Prepare the upload

Make a `POST` request to [`/marble/v1/media-assets:prepare_upload`](/api/reference/media-assets/prepare-upload) to get a signed upload URL.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/media-assets:prepare_upload' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "file_name": "my-image.jpg",
    "kind": "image",
    "extension": "jpg"
  }'
```

This returns the media asset and upload information:

Copy

```python
{
  "media_asset": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "file_name": "my-image.jpg",
    "kind": "image",
    "extension": "jpg",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": null,
    "metadata": null
  },
  "upload_info": {
    "upload_url": "<signed_upload_url>",
    "upload_method": "PUT",
    "required_headers": {
      "x-goog-content-length-range": "0,1048576000"
    }
  }
}
```

2

Upload the file

Upload your image to the signed URL using the method and headers from the response.

Request

Copy

```python
curl -X PUT '<signed_upload_url>' \
  -H 'x-goog-content-length-range: 0,1048576000' \
  --data-binary '@/path/to/my-image.jpg'
```

3

Generate the world

Use the `media_asset_id` from Step 1 to generate a world.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "My Image World",
    "world_prompt": {
      "type": "image",
      "image_prompt": {
        "source": "media_asset",
        "media_asset_id": "550e8400-e29b-41d4-a716-446655440000"
      },
      "text_prompt": "A beautiful landscape"
    }
  }'
```

This returns an Operation object. Poll the operation as shown in the text input example until `done` is `true`. The completed operation’s `response` field will contain the generated World.

The `text_prompt` field is optional. If omitted, a caption will be automatically generated from your image.

Set `is_pano: true` in the `image_prompt` if your input image is a panorama.

You can create a world from multiple images of the same scene, each with an optional azimuth (horizontal angle in degrees).Recommended image formats: `jpg`, `jpeg`, `png`, `webp`.

* From URLs
* From local files

If your images are already hosted at public URLs, you can reference them directly.

1

Make a `POST` request to the [`/marble/v1/worlds:generate`](/api/reference/worlds/generate) endpoint with your image URLs and their azimuth positions.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "My Multi-Image World",
    "world_prompt": {
      "type": "multi-image",
      "multi_image_prompt": [
        {
          "azimuth": 0,
          "content": {
            "source": "uri",
            "uri": "https://example.com/front.jpg"
          }
        },
        {
          "azimuth": 180,
          "content": {
            "source": "uri",
            "uri": "https://example.com/back.jpg"
          }
        }
      ],
      "text_prompt": "A cozy living room"
    }
  }'
```

This returns an Operation object. Poll the operation as shown in the text input example until `done` is `true`. The completed operation’s `response` field will contain the generated World.

To use local image files, first upload each as a media asset, then reference them in your generation request.

1

Prepare and upload each image

For each image, prepare the upload and upload the file as shown in the [image input example](#from-local-file).

Request

Copy

```python
# Prepare upload for first image
curl -X POST 'https://api.worldlabs.ai/marble/v1/media-assets:prepare_upload' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "file_name": "front.jpg",
    "kind": "image",
    "extension": "jpg"
  }'

# Upload the file to the returned upload_url
curl -X PUT '<upload_url>' \
  -H 'Content-Type: image/jpeg' \
  --data-binary '@/path/to/front.jpg'

# Repeat for each additional image
```

2

Generate the world

Use the media asset IDs to generate a world.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "My Multi-Image World",
    "world_prompt": {
      "type": "multi-image",
      "multi_image_prompt": [
        {
          "azimuth": 0,
          "content": {
            "source": "media_asset",
            "media_asset_id": "<front_image_id>"
          }
        },
        {
          "azimuth": 180,
          "content": {
            "source": "media_asset",
            "media_asset_id": "<back_image_id>"
          }
        }
      ],
      "text_prompt": "A cozy living room"
    }
  }'
```

This returns an Operation object. Poll the operation as shown in the text input example until `done` is `true`. The completed operation’s `response` field will contain the generated World.

The `azimuth` field specifies the horizontal angle (in degrees) where the image was taken. Use `0` for front, `90` for right, `180` for back, `270` for left.

The `text_prompt` field is optional. If omitted, a caption will be automatically generated.

You can create a world from a video using either a public URL or by uploading a local file.Recommended video formats: `mp4`, `mov`, `mkv`.

* From URL
* From local file

If your video is already hosted at a public URL, you can reference it directly.

1

Make a `POST` request to the [`/marble/v1/worlds:generate`](/api/reference/worlds/generate) endpoint with your video URL.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "My Video World",
    "world_prompt": {
      "type": "video",
      "video_prompt": {
        "source": "uri",
        "uri": "https://example.com/my-video.mp4"
      },
      "text_prompt": "A scenic mountain landscape"
    }
  }'
```

This returns an Operation object. Poll the operation as shown in the text input example until `done` is `true`. The completed operation’s `response` field will contain the generated World.

To use a local video file, first upload it as a media asset, then reference it in your generation request.

1

Prepare the upload

Make a `POST` request to [`/marble/v1/media-assets:prepare_upload`](/api/reference/media-assets/prepare-upload) to get a signed upload URL.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/media-assets:prepare_upload' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "file_name": "my-video.mp4",
    "kind": "video",
    "extension": "mp4"
  }'
```

This returns the media asset and upload information:

Copy

```python
{
  "media_asset": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "file_name": "my-video.mp4",
    "kind": "video",
    "extension": "mp4",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": null,
    "metadata": null
  },
  "upload_info": {
    "upload_url": "<signed_upload_url>",
    "upload_method": "PUT",
    "required_headers": {
      "x-goog-content-length-range": "0,1048576000"
    }
  }
}
```

2

Upload the file

Upload your video to the signed URL using the method and headers from the response.

Request

Copy

```python
curl -X PUT '<signed_upload_url>' \
  -H 'x-goog-content-length-range: 0,1048576000' \
  --data-binary '@/path/to/my-video.mp4'
```

3

Generate the world

Use the `media_asset_id` from Step 1 to generate a world.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "My Video World",
    "world_prompt": {
      "type": "video",
      "video_prompt": {
        "source": "media_asset",
        "media_asset_id": "550e8400-e29b-41d4-a716-446655440000"
      },
      "text_prompt": "A scenic mountain landscape"
    }
  }'
```

This returns an Operation object. Poll the operation as shown in the text input example until `done` is `true`. The completed operation’s `response` field will contain the generated World.

The `text_prompt` field is optional. If omitted, a caption will be automatically generated from your video.

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/reference/worlds/get

[Skip to main content](#content-area)

[World Labs home page![light logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/light.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=e8a47e11f09a015f4e2461d9c026f36d)![dark logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/dark.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=83022c4e82ec8ac3d43c355bfaf2a06f)](/)

##### Get started

* [Quickstart](/api)
* [Tools & examples](/api/examples)

##### Reference

* + [POST

    Prepare media asset upload](/api/reference/media-assets/prepare-upload)
  + [GET

    Get media asset](/api/reference/media-assets/get)
* + [POST

    Generate a World](/api/reference/worlds/generate)
  + [GET

    Get a World](/api/reference/worlds/get)
  + [POST

    List Worlds](/api/reference/worlds/list)
* + [GET

    Get an Operation](/api/reference/operations/get)
* [OpenAPI spec](/api/reference/openapi)

##### Support & billing

* [Pricing](/api/pricing)
* [Rate limits](/api/rate-limits)
* [Frequently asked questions](/api/faq)

* [Discord](https://discord.gg/jSSSgXWT3v)
* [Company](https://worldlabs.ai)
* [Go to Marble](https://marble.worldlabs.ai)

[World Labs home page![light logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/light.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=e8a47e11f09a015f4e2461d9c026f36d)![dark logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/dark.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=83022c4e82ec8ac3d43c355bfaf2a06f)](/)

[Marble](/)[API](/api)

[Marble](/)[API](/api)

GET

/

marble

/

v1

/

worlds

/

{world\_id}

Get World

Copy

```python
curl --request GET \
  --url https://api.worldlabs.ai/marble/v1/worlds/{world_id} \
  --header 'WLT-Api-Key: <api-key>'
```

Copy

```python
{
  "display_name": "<string>",
  "world_id": "<string>",
  "world_marble_url": "<string>",
  "assets": {
    "caption": "<string>",
    "imagery": {
      "pano_url": "<string>"
    },
    "mesh": {
      "collider_mesh_url": "<string>"
    },
    "splats": {
      "spz_urls": {}
    },
    "thumbnail_url": "<string>"
  },
  "created_at": "2023-11-07T05:31:56Z",
  "model": "<string>",
  "permission": {
    "allowed_readers": [
      "<string>"
    ],
    "allowed_writers": [
      "<string>"
    ],
    "public": false
  },
  "tags": [
    "<string>"
  ],
  "updated_at": "2023-11-07T05:31:56Z",
  "world_prompt": {
    "text_prompt": "<string>",
    "type": "text"
  }
}
```

#### Authorizations

[​](#authorization-wlt-api-key)

WLT-Api-Key

string

header

required

API key for authentication. Get your key from the developer portal.

#### Path Parameters

[​](#parameter-world-id)

world\_id

string

required

#### Response

Successful Response

A generated world, including asset URLs.

[​](#response-display-name)

display\_name

string

required

Display name

[​](#response-world-id)

world\_id

string

required

World identifier

[​](#response-world-marble-url)

world\_marble\_url

string

required

World Marble URL

[​](#response-assets-one-of-0)

assets

WorldAssets · object

Generated world assets

Show child attributes

[​](#response-created-at-one-of-0)

created\_at

string<date-time> | null

Creation timestamp

[​](#response-model-one-of-0)

model

string | null

Model used for generation

[​](#response-permission-one-of-0)

permission

Permission · object

Access control permissions for the world

Show child attributes

[​](#response-tags-one-of-0)

tags

string[] | null

Tags associated with the world

[​](#response-updated-at-one-of-0)

updated\_at

string<date-time> | null

Last update timestamp

[​](#response-world-prompt)

world\_prompt

WorldTextPrompt · object

Input prompt class for text-conditioned world generation.

* WorldTextPrompt
* Prompt
* MultiImagePrompt
* VideoPrompt
* DepthPanoPrompt
* InpaintPanoPrompt

Show child attributes

Was this page helpful?

[Previous](/api/reference/worlds/generate)[List WorldsList worlds with optional filters.
Returns worlds created through the API with optional filtering and pagination.
Args:
request: List request with optional filters:
- page\_size: Number of results per page (default: 10)
- page\_token: Pagination token from previous response
- status: Filter by status (e.g., "COMPLETED")
- model: Filter by model name (e.g., "Marble 0.1-plus")
- tags: Filter by tags (matches worlds with any tag)
- is\_public: Filter by visibility (true=public, false=private, null=all)
- created\_after: Filter by creation time (after timestamp)
- created\_before: Filter by creation time (before timestamp)
- sort\_by: Sort order ("created\_at" or "updated\_at")
Returns:
ListWorldsResponse with worlds list and next\_page\_token for pagination.
Raises:
HTTPException: 400 if invalid parameters
HTTPException: 500 if request fails

Next](/api/reference/worlds/list)

⌘I

Get World

Copy

```python
curl --request GET \
  --url https://api.worldlabs.ai/marble/v1/worlds/{world_id} \
  --header 'WLT-Api-Key: <api-key>'
```

Copy

```python
{
  "display_name": "<string>",
  "world_id": "<string>",
  "world_marble_url": "<string>",
  "assets": {
    "caption": "<string>",
    "imagery": {
      "pano_url": "<string>"
    },
    "mesh": {
      "collider_mesh_url": "<string>"
    },
    "splats": {
      "spz_urls": {}
    },
    "thumbnail_url": "<string>"
  },
  "created_at": "2023-11-07T05:31:56Z",
  "model": "<string>",
  "permission": {
    "allowed_readers": [
      "<string>"
    ],
    "allowed_writers": [
      "<string>"
    ],
    "public": false
  },
  "tags": [
    "<string>"
  ],
  "updated_at": "2023-11-07T05:31:56Z",
  "world_prompt": {
    "text_prompt": "<string>",
    "type": "text"
  }
}
```

Assistant

Responses are generated using AI and may contain mistakes.

[Contact support](mailto:support@worldlabs.ai)

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/rate-limits

## [​](#rate-limits) Rate limits

Each API user is limited to **about 6 world generation requests per minute**. This is to ensure fair usage and prevent abuse.
Note that this limit is not per API key, but rather per API user.
Usage is tracked in a rolling window, and the limit is not guaranteed to be exact. For example, you may very occasionally find you can only make 5 requests in a 1 minute window.

### [​](#how-to-handle-rate-limits) How to handle rate limits

If you exceed the rate limit, you will receive a 429 error. You can retry your request after the rate limit has been reset.

### [​](#time-estimates) Time estimates

Each world generation will take about 5 minutes to complete.

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/pricing

## [​](#credits) Credits

World API billing is separate from Marble web app billing.

* Credits purchased for the Marble app at <marble.worldlabs.ai> CANNOT be used with the API
* API usage requires credits purchased through the World Labs Platform at <platform.worldlabs.ai>

If you plan to use the API, make sure you purchase credits on the World Labs Platform, not in the Marble app.

The World Labs API uses a credit-based pricing model.
You may purchase credits at a fixed rate of $1.00 USD per 1,250 credits through the [World Labs Platform](https://platform.worldlabs.ai/billing). The minimum purchase is 6,250 credits or $5.00 USD.
API credits do not expire.

### [​](#auto-refill) Auto-refill

You may enable auto-refill to avoid service interruptions by automatically purchasing credits when your balance is low.
On the [billing page](https://platform.worldlabs.ai/billing), you may enable and configure auto-refill once you have a payment method on file.
You may configure the threshold at which auto-refill is triggered, as well as the target balance to refill to.

Note that when auto-refill is triggered, your balance will not settle at the target balance. This is because the refill is applied before the cost of the API request is deducted from your balance.For example, assume your threshold is 10,000 credits and your target balance is 20,000 credits, and you have a balance of 10,000 credits.

1. You make an API request that costs 1,500 credits. We would observe that your balance would drop to 8,500 credits, which is below your threshold.
2. The auto-refill would then be triggered and you would be charged to bring your balance to 20,000 credits.
3. Finally, your balance would drop to 18,500 credits to charge for the API request.

## [​](#usage-events) Usage events

Credits are consumed as you use the API.
API requests may map to one or more usage events, and each usage event may have its own cost in credits associated with it. The total cost of an API request is the sum of the costs of all the usage events it maps to. The cost of each usage event is determined largely by the compute resources required to complete the underlying operation.
You may view your usage event history in the [usage page](https://platform.worldlabs.ai/usage).
Note that not all API requests consume credits, such as API key creation, media asset upload and management, and Operation polling.

### [​](#world-generation-pricing) World generation pricing

Generating a world using the [World Generation API](/api/reference/worlds/generate) is the most common API request. However, the number of usage events and the cost of generating a world depends on the input type.
The World Generation API requires a panorama image (pano) to convert into a 3D world, so it will first generate a pano from your input if a pano is not provided. As a result, a World Generation API request often includes two usage events:

1. Pano generation (if needed)
2. World generation (from pano)

The **world generation** usage event is billed at **1,500 credits** for **Standard / Marble 0.1-plus**, and **150 credits** for **Draft / Marble 0.1-mini**.
Depending on your input type, you may also incur a **pano generation** usage event. If you generate from an existing pano, there is no pano generation step, so there is no additional cost.

#### [​](#pricing-standard-/-marble-0-1-plus) Pricing (Standard / Marble 0.1-plus)

| Input type | Pano generation | World generation | Total |
| --- | --- | --- | --- |
| Image (pano) | 0 | 1,500 | 1,500 |
| Text | 80 | 1,500 | 1,580 |
| Image (non-pano) | 80 | 1,500 | 1,580 |
| Multi-image | 100 | 1,500 | 1,600 |
| Video | 100 | 1,500 | 1,600 |

#### [​](#pricing-draft-/-marble-0-1-mini) Pricing (Draft / Marble 0.1-mini)

| Input type | Pano generation | World generation | Total |
| --- | --- | --- | --- |
| Image (pano) | 0 | 150 | 150 |
| Text | 80 | 150 | 230 |
| Image (non-pano) | 80 | 150 | 230 |
| Multi-image | 100 | 150 | 250 |
| Video | 100 | 150 | 250 |

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/faq

### [​](#can-i-retrieve-ply-files-from-the-api) Can I retrieve PLY files from the API?

The World Labs API currently returns scene geometry in **.spz (3D Gaussian Splat)** format only. Direct export of .ply files via the API is not supported.
For production or large-scale workflows, .spz files should be converted programmatically using existing libraries:

* C++: <https://github.com/nianticlabs/spzJavaScript>
* TypeScript: <https://github.com/arrival-space/spz-js>

For small-scale or one-off use, a hosted web tool is available for ad-hoc conversion: <https://spz-to-ply.netlify.app>

### [​](#how-does-api-billing-work) How does API billing work?

Billing for the World API is separate from billing for the Marble web app.

* Credits purchased for the Marble app cannot be used with the API
* API usage requires credits purchased through the World Labs Platform

If you plan to use the API, make sure you purchase credits on the World Labs Platform, NOT in the Marble app.

### [​](#how-do-i-get-a-panorama-image-from-my-world-generation) How do I get a panorama image from my world generation?

Every world generation includes a panorama image in the response, accessible via `assets.imagery.pano_url`. This panorama is automatically generated as part of the world creation process.
If you only need the panorama and want faster, cheaper results, use `Marble 0.1-mini` (draft mode):

* Generation time: 30-45 seconds (vs. 5+ minutes for `Marble 0.1-plus`)
* Cost: 150-330 credits (vs. 1,500-1,600 credits for `Marble 0.1-plus`)

To use draft mode, add `"model": "Marble 0.1-mini"` to your world generation request:

Copy

```python
{
  "display_name": "Quick Panorama",
  "world_prompt": {
    "type": "text",
    "text_prompt": "A serene mountain landscape"
  },
  "model": "Marble 0.1-mini"
}
```

The panorama URL will be available in the response at `operation.response.assets.imagery.pano_url` or when you fetch the world via `GET /marble/v1/worlds/{world_id}`.

### [​](#what-is-the-difference-between-the-marble-0-1-mini-and-marble-0-1-plus-models-when-should-i-use-each) What is the difference between the `Marble 0.1-mini` and `Marble 0.1-plus` models? When should I use each?

World Labs offers two model variants for scene generation:

* `Marble 0.1-mini` is optimized for **speed and cost**. It’s best suited for rapid iteration, previews, testing, and large-scale batch jobs where throughput matters more than maximum fidelity.
* `Marble 0.1-plus` prioritizes **higher visual quality and detail**. It’s recommended for final assets, production scenes, and use cases where accuracy and realism are important.

**Best practice**: Use `Marble 0.1-mini` during development and experimentation, then switch to `Marble 0.1-plus` for final or customer-facing outputs.

### [​](#where-can-i-read-more-about-world-labs-policies) Where can I read more about World Labs policies?

Please view our [Terms of Service](/terms-of-service) and [Privacy Policy](/privacy-policy) for details.

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/reference/worlds/list

[Skip to main content](#content-area)

[World Labs home page![light logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/light.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=e8a47e11f09a015f4e2461d9c026f36d)![dark logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/dark.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=83022c4e82ec8ac3d43c355bfaf2a06f)](/)

##### Get started

* [Quickstart](/api)
* [Tools & examples](/api/examples)

##### Reference

* + [POST

    Prepare media asset upload](/api/reference/media-assets/prepare-upload)
  + [GET

    Get media asset](/api/reference/media-assets/get)
* + [POST

    Generate a World](/api/reference/worlds/generate)
  + [GET

    Get a World](/api/reference/worlds/get)
  + [POST

    List Worlds](/api/reference/worlds/list)
* + [GET

    Get an Operation](/api/reference/operations/get)
* [OpenAPI spec](/api/reference/openapi)

##### Support & billing

* [Pricing](/api/pricing)
* [Rate limits](/api/rate-limits)
* [Frequently asked questions](/api/faq)

* [Discord](https://discord.gg/jSSSgXWT3v)
* [Company](https://worldlabs.ai)
* [Go to Marble](https://marble.worldlabs.ai)

[World Labs home page![light logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/light.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=e8a47e11f09a015f4e2461d9c026f36d)![dark logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/dark.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=83022c4e82ec8ac3d43c355bfaf2a06f)](/)

[Marble](/)[API](/api)

[Marble](/)[API](/api)

POST

/

marble

/

v1

/

worlds:list

List Worlds

Copy

```python
curl --request POST \
  --url https://api.worldlabs.ai/marble/v1/worlds:list \
  --header 'Content-Type: application/json' \
  --header 'WLT-Api-Key: <api-key>' \
  --data '
{
  "created_after": "2023-11-07T05:31:56Z",
  "created_before": "2023-11-07T05:31:56Z",
  "is_public": true,
  "model": "Marble 0.1-mini",
  "page_size": 20,
  "page_token": "<string>",
  "sort_by": "created_at",
  "status": "SUCCEEDED",
  "tags": [
    "<string>"
  ]
}
'
```

Copy

```python
{
  "worlds": [
    {
      "display_name": "<string>",
      "world_id": "<string>",
      "world_marble_url": "<string>",
      "assets": {
        "caption": "<string>",
        "imagery": {
          "pano_url": "<string>"
        },
        "mesh": {
          "collider_mesh_url": "<string>"
        },
        "splats": {
          "spz_urls": {}
        },
        "thumbnail_url": "<string>"
      },
      "created_at": "2023-11-07T05:31:56Z",
      "model": "<string>",
      "permission": {
        "allowed_readers": [
          "<string>"
        ],
        "allowed_writers": [
          "<string>"
        ],
        "public": false
      },
      "tags": [
        "<string>"
      ],
      "updated_at": "2023-11-07T05:31:56Z",
      "world_prompt": {
        "text_prompt": "<string>",
        "type": "text"
      }
    }
  ],
  "next_page_token": "<string>"
}
```

#### Authorizations

[​](#authorization-wlt-api-key)

WLT-Api-Key

string

header

required

API key for authentication. Get your key from the developer portal.

#### Body

application/json

Request to list API-generated worlds with optional filters.

[​](#body-created-after-one-of-0)

created\_after

string<date-time> | null

Filter worlds created after this timestamp (inclusive)

[​](#body-created-before-one-of-0)

created\_before

string<date-time> | null

Filter worlds created before this timestamp (exclusive)

[​](#body-is-public-one-of-0)

is\_public

boolean | null

Filter by public visibility (true=public, false=private)

[​](#body-model-one-of-0)

model

enum<string> | null

Filter by model used for generation

Available options:

`Marble 0.1-mini`,

`Marble 0.1-plus`

[​](#body-page-size)

page\_size

integer

default:20

Number of results per page (1-100)

Required range: `1 <= x <= 100`

[​](#body-page-token-one-of-0)

page\_token

string | null

Cursor token for pagination (opaque base64 string from previous response)

[​](#body-sort-by)

sort\_by

enum<string>

default:created\_at

Sort results by created\_at or updated\_at

Available options:

`created_at`,

`updated_at`

[​](#body-status-one-of-0)

status

enum<string> | null

Filter by world status

Available options:

`SUCCEEDED`,

`PENDING`,

`FAILED`,

`RUNNING`

[​](#body-tags-one-of-0)

tags

string[] | null

Filter by tags (returns worlds with ANY of these tags)

#### Response

Successful Response

Response containing a list of API-generated worlds.

[​](#response-worlds)

worlds

World · object[]

required

List of worlds

Show child attributes

[​](#response-next-page-token-one-of-0)

next\_page\_token

string | null

Token for fetching the next page of results

Was this page helpful?

[Previous](/api/reference/worlds/get)[Get an OperationGet an operation by ID.
Poll this endpoint to check the status of a long-running operation.
When done=true, the response field contains the generated world.
Args:
operation\_id: The operation identifier from /worlds:generate.
Returns:
GetOperationResponse[World] with:
- operation\_id: Operation identifier
- created\_at: Creation timestamp
- updated\_at: Last update timestamp
- expires\_at: Expiration timestamp
- done: true when complete, false while in progress
- error: Error details if failed, null otherwise
- metadata: Progress information and world\_id
- response: Generated World if done=true, null otherwise
Raises:
HTTPException: 401 if unauthorized
HTTPException: 404 if operation not found
HTTPException: 500 if request fails

Next](/api/reference/operations/get)

⌘I

List Worlds

Copy

```python
curl --request POST \
  --url https://api.worldlabs.ai/marble/v1/worlds:list \
  --header 'Content-Type: application/json' \
  --header 'WLT-Api-Key: <api-key>' \
  --data '
{
  "created_after": "2023-11-07T05:31:56Z",
  "created_before": "2023-11-07T05:31:56Z",
  "is_public": true,
  "model": "Marble 0.1-mini",
  "page_size": 20,
  "page_token": "<string>",
  "sort_by": "created_at",
  "status": "SUCCEEDED",
  "tags": [
    "<string>"
  ]
}
'
```

Copy

```python
{
  "worlds": [
    {
      "display_name": "<string>",
      "world_id": "<string>",
      "world_marble_url": "<string>",
      "assets": {
        "caption": "<string>",
        "imagery": {
          "pano_url": "<string>"
        },
        "mesh": {
          "collider_mesh_url": "<string>"
        },
        "splats": {
          "spz_urls": {}
        },
        "thumbnail_url": "<string>"
      },
      "created_at": "2023-11-07T05:31:56Z",
      "model": "<string>",
      "permission": {
        "allowed_readers": [
          "<string>"
        ],
        "allowed_writers": [
          "<string>"
        ],
        "public": false
      },
      "tags": [
        "<string>"
      ],
      "updated_at": "2023-11-07T05:31:56Z",
      "world_prompt": {
        "text_prompt": "<string>",
        "type": "text"
      }
    }
  ],
  "next_page_token": "<string>"
}
```

Assistant

Responses are generated using AI and may contain mistakes.

[Contact support](mailto:support@worldlabs.ai)

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/platform.worldlabs.ai

404

# Page Not Found

We couldn't find the page.

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/reference/operations/get

[Skip to main content](#content-area)

[World Labs home page![light logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/light.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=e8a47e11f09a015f4e2461d9c026f36d)![dark logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/dark.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=83022c4e82ec8ac3d43c355bfaf2a06f)](/)

##### Get started

* [Quickstart](/api)
* [Tools & examples](/api/examples)

##### Reference

* + [POST

    Prepare media asset upload](/api/reference/media-assets/prepare-upload)
  + [GET

    Get media asset](/api/reference/media-assets/get)
* + [POST

    Generate a World](/api/reference/worlds/generate)
  + [GET

    Get a World](/api/reference/worlds/get)
  + [POST

    List Worlds](/api/reference/worlds/list)
* + [GET

    Get an Operation](/api/reference/operations/get)
* [OpenAPI spec](/api/reference/openapi)

##### Support & billing

* [Pricing](/api/pricing)
* [Rate limits](/api/rate-limits)
* [Frequently asked questions](/api/faq)

* [Discord](https://discord.gg/jSSSgXWT3v)
* [Company](https://worldlabs.ai)
* [Go to Marble](https://marble.worldlabs.ai)

[World Labs home page![light logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/light.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=e8a47e11f09a015f4e2461d9c026f36d)![dark logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/dark.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=83022c4e82ec8ac3d43c355bfaf2a06f)](/)

[Marble](/)[API](/api)

[Marble](/)[API](/api)

GET

/

marble

/

v1

/

operations

/

{operation\_id}

Get Operation

Copy

```python
curl --request GET \
  --url https://api.worldlabs.ai/marble/v1/operations/{operation_id} \
  --header 'WLT-Api-Key: <api-key>'
```

Copy

```python
{
  "done": true,
  "operation_id": "<string>",
  "created_at": "2023-11-07T05:31:56Z",
  "error": {
    "code": 123,
    "message": "<string>"
  },
  "expires_at": "2023-11-07T05:31:56Z",
  "metadata": {},
  "response": {
    "display_name": "<string>",
    "world_id": "<string>",
    "world_marble_url": "<string>",
    "assets": {
      "caption": "<string>",
      "imagery": {
        "pano_url": "<string>"
      },
      "mesh": {
        "collider_mesh_url": "<string>"
      },
      "splats": {
        "spz_urls": {}
      },
      "thumbnail_url": "<string>"
    },
    "created_at": "2023-11-07T05:31:56Z",
    "model": "<string>",
    "permission": {
      "allowed_readers": [
        "<string>"
      ],
      "allowed_writers": [
        "<string>"
      ],
      "public": false
    },
    "tags": [
      "<string>"
    ],
    "updated_at": "2023-11-07T05:31:56Z",
    "world_prompt": {
      "text_prompt": "<string>",
      "type": "text"
    }
  },
  "updated_at": "2023-11-07T05:31:56Z"
}
```

#### Authorizations

[​](#authorization-wlt-api-key)

WLT-Api-Key

string

header

required

API key for authentication. Get your key from the developer portal.

#### Path Parameters

[​](#parameter-operation-id)

operation\_id

string

required

#### Response

Successful Response

[​](#response-done)

done

boolean

required

True if the operation is completed

[​](#response-operation-id)

operation\_id

string

required

Operation identifier

[​](#response-created-at-one-of-0)

created\_at

string<date-time> | null

Creation timestamp

[​](#response-error-one-of-0)

error

OperationError · object

Error information if the operation failed

Show child attributes

[​](#response-expires-at-one-of-0)

expires\_at

string<date-time> | null

Expiration timestamp

[​](#response-metadata-one-of-0)

metadata

Metadata · object

Service-specific metadata, such as progress percentage

[​](#response-response-one-of-0)

response

World · object

Result payload when done=true and no error. Structure depends on operation type.

Show child attributes

[​](#response-updated-at-one-of-0)

updated\_at

string<date-time> | null

Last update timestamp

Was this page helpful?

[Previous](/api/reference/worlds/list)[OpenAPI specView the OpenAPI specification file

Next](/api/reference/openapi)

⌘I

Get Operation

Copy

```python
curl --request GET \
  --url https://api.worldlabs.ai/marble/v1/operations/{operation_id} \
  --header 'WLT-Api-Key: <api-key>'
```

Copy

```python
{
  "done": true,
  "operation_id": "<string>",
  "created_at": "2023-11-07T05:31:56Z",
  "error": {
    "code": 123,
    "message": "<string>"
  },
  "expires_at": "2023-11-07T05:31:56Z",
  "metadata": {},
  "response": {
    "display_name": "<string>",
    "world_id": "<string>",
    "world_marble_url": "<string>",
    "assets": {
      "caption": "<string>",
      "imagery": {
        "pano_url": "<string>"
      },
      "mesh": {
        "collider_mesh_url": "<string>"
      },
      "splats": {
        "spz_urls": {}
      },
      "thumbnail_url": "<string>"
    },
    "created_at": "2023-11-07T05:31:56Z",
    "model": "<string>",
    "permission": {
      "allowed_readers": [
        "<string>"
      ],
      "allowed_writers": [
        "<string>"
      ],
      "public": false
    },
    "tags": [
      "<string>"
    ],
    "updated_at": "2023-11-07T05:31:56Z",
    "world_prompt": {
      "text_prompt": "<string>",
      "type": "text"
    }
  },
  "updated_at": "2023-11-07T05:31:56Z"
}
```

Assistant

Responses are generated using AI and may contain mistakes.

[Contact support](mailto:support@worldlabs.ai)

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/reference/worlds/generate

[Skip to main content](#content-area)

[World Labs home page![light logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/light.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=e8a47e11f09a015f4e2461d9c026f36d)![dark logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/dark.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=83022c4e82ec8ac3d43c355bfaf2a06f)](/)

##### Get started

* [Quickstart](/api)
* [Tools & examples](/api/examples)

##### Reference

* + [POST

    Prepare media asset upload](/api/reference/media-assets/prepare-upload)
  + [GET

    Get media asset](/api/reference/media-assets/get)
* + [POST

    Generate a World](/api/reference/worlds/generate)
  + [GET

    Get a World](/api/reference/worlds/get)
  + [POST

    List Worlds](/api/reference/worlds/list)
* + [GET

    Get an Operation](/api/reference/operations/get)
* [OpenAPI spec](/api/reference/openapi)

##### Support & billing

* [Pricing](/api/pricing)
* [Rate limits](/api/rate-limits)
* [Frequently asked questions](/api/faq)

* [Discord](https://discord.gg/jSSSgXWT3v)
* [Company](https://worldlabs.ai)
* [Go to Marble](https://marble.worldlabs.ai)

[World Labs home page![light logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/light.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=e8a47e11f09a015f4e2461d9c026f36d)![dark logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/dark.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=83022c4e82ec8ac3d43c355bfaf2a06f)](/)

[Marble](/)[API](/api)

[Marble](/)[API](/api)

POST

/

marble

/

v1

/

worlds:generate

Generate World

Copy

```python
curl --request POST \
  --url https://api.worldlabs.ai/marble/v1/worlds:generate \
  --header 'Content-Type: application/json' \
  --header 'WLT-Api-Key: <api-key>' \
  --data '
{
  "world_prompt": {
    "disable_recaption": true,
    "text_prompt": "<string>",
    "type": "text"
  },
  "display_name": "<string>",
  "model": "Marble 0.1-plus",
  "permission": {
    "allowed_readers": [],
    "allowed_writers": [],
    "public": false
  },
  "seed": 1,
  "tags": [
    "<string>"
  ]
}
'
```

Copy

```python
{
  "done": true,
  "operation_id": "<string>",
  "created_at": "2023-11-07T05:31:56Z",
  "error": {
    "code": 123,
    "message": "<string>"
  },
  "expires_at": "2023-11-07T05:31:56Z",
  "metadata": {},
  "response": "<unknown>",
  "updated_at": "2023-11-07T05:31:56Z"
}
```

#### Authorizations

[​](#authorization-wlt-api-key)

WLT-Api-Key

string

header

required

API key for authentication. Get your key from the developer portal.

#### Body

application/json

Request to generate a world from text, image, multi-image, or video input.

[​](#body-world-prompt)

world\_prompt

WorldTextPrompt · object

required

Text-to-world generation.

Generates a world from a text description. text\_prompt is REQUIRED.

* WorldTextPrompt
* ImagePrompt
* MultiImagePrompt
* VideoPrompt

Show child attributes

[​](#body-display-name-one-of-0)

display\_name

string | null

Optional display name

[​](#body-model)

model

enum<string>

default:Marble 0.1-plus

The model to use for generation

Available options:

`Marble 0.1-mini`,

`Marble 0.1-plus`

[​](#body-permission)

permission

Permission · object

The permission for the world

Show child attributes

[​](#body-seed-one-of-0)

seed

integer | null

Random seed for generation

Required range: `x >= 0`

[​](#body-tags-one-of-0)

tags

string[] | null

Optional tags for the world

#### Response

Successful Response

Response from world generation endpoint.

[​](#response-done)

done

boolean

required

True if the operation is completed

[​](#response-operation-id)

operation\_id

string

required

Operation identifier

[​](#response-created-at-one-of-0)

created\_at

string<date-time> | null

Creation timestamp

[​](#response-error-one-of-0)

error

OperationError · object

Error information if the operation failed

Show child attributes

[​](#response-expires-at-one-of-0)

expires\_at

string<date-time> | null

Expiration timestamp

[​](#response-metadata-one-of-0)

metadata

Metadata · object

Service-specific metadata, such as progress percentage

[​](#response-response-one-of-0)

response

any | null

Result payload when done=true and no error. Structure depends on operation type.

[​](#response-updated-at-one-of-0)

updated\_at

string<date-time> | null

Last update timestamp

Was this page helpful?

[Previous](/api/reference/media-assets/get)[Get a WorldGet a world by ID.
Retrieves a world's details including generated assets if available.
Only the world owner or users with access to public worlds can retrieve them.
Args:
world\_id: The unique identifier of the world.
Returns:
World object with world\_id, display\_name, tags, assets, created\_at,
updated\_at, permission, model, world\_prompt, and world\_marble\_url.
Raises:
HTTPException: 404 if world not found or access denied

Next](/api/reference/worlds/get)

⌘I

Generate World

Copy

```python
curl --request POST \
  --url https://api.worldlabs.ai/marble/v1/worlds:generate \
  --header 'Content-Type: application/json' \
  --header 'WLT-Api-Key: <api-key>' \
  --data '
{
  "world_prompt": {
    "disable_recaption": true,
    "text_prompt": "<string>",
    "type": "text"
  },
  "display_name": "<string>",
  "model": "Marble 0.1-plus",
  "permission": {
    "allowed_readers": [],
    "allowed_writers": [],
    "public": false
  },
  "seed": 1,
  "tags": [
    "<string>"
  ]
}
'
```

Copy

```python
{
  "done": true,
  "operation_id": "<string>",
  "created_at": "2023-11-07T05:31:56Z",
  "error": {
    "code": 123,
    "message": "<string>"
  },
  "expires_at": "2023-11-07T05:31:56Z",
  "metadata": {},
  "response": "<unknown>",
  "updated_at": "2023-11-07T05:31:56Z"
}
```

Assistant

Responses are generated using AI and may contain mistakes.

[Contact support](mailto:support@worldlabs.ai)

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/reference/media-assets/get

[Skip to main content](#content-area)

[World Labs home page![light logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/light.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=e8a47e11f09a015f4e2461d9c026f36d)![dark logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/dark.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=83022c4e82ec8ac3d43c355bfaf2a06f)](/)

##### Get started

* [Quickstart](/api)
* [Tools & examples](/api/examples)

##### Reference

* + [POST

    Prepare media asset upload](/api/reference/media-assets/prepare-upload)
  + [GET

    Get media asset](/api/reference/media-assets/get)
* + [POST

    Generate a World](/api/reference/worlds/generate)
  + [GET

    Get a World](/api/reference/worlds/get)
  + [POST

    List Worlds](/api/reference/worlds/list)
* + [GET

    Get an Operation](/api/reference/operations/get)
* [OpenAPI spec](/api/reference/openapi)

##### Support & billing

* [Pricing](/api/pricing)
* [Rate limits](/api/rate-limits)
* [Frequently asked questions](/api/faq)

* [Discord](https://discord.gg/jSSSgXWT3v)
* [Company](https://worldlabs.ai)
* [Go to Marble](https://marble.worldlabs.ai)

[World Labs home page![light logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/light.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=e8a47e11f09a015f4e2461d9c026f36d)![dark logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/dark.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=83022c4e82ec8ac3d43c355bfaf2a06f)](/)

[Marble](/)[API](/api)

[Marble](/)[API](/api)

GET

/

marble

/

v1

/

media-assets

/

{media\_asset\_id}

Get Media Asset

Copy

```python
curl --request GET \
  --url https://api.worldlabs.ai/marble/v1/media-assets/{media_asset_id} \
  --header 'WLT-Api-Key: <api-key>'
```

Copy

```python
{
  "created_at": "2023-11-07T05:31:56Z",
  "file_name": "<string>",
  "kind": "image",
  "media_asset_id": "<string>",
  "extension": "mp4",
  "metadata": {},
  "updated_at": "2023-11-07T05:31:56Z"
}
```

#### Authorizations

[​](#authorization-wlt-api-key)

WLT-Api-Key

string

header

required

API key for authentication. Get your key from the developer portal.

#### Path Parameters

[​](#parameter-media-asset-id)

media\_asset\_id

string

required

#### Response

Successful Response

A user-uploaded media asset stored in managed storage.

MediaAssets can be images, videos, or binary blobs that are used
as input to world generation.

[​](#response-created-at)

created\_at

string<date-time>

required

Creation timestamp

[​](#response-file-name)

file\_name

string

required

File name

[​](#response-kind)

kind

enum<string>

required

High-level media type

Available options:

`image`,

`video`

Examples:

`"image"`

`"video"`

[​](#response-media-asset-id)

media\_asset\_id

string

required

Server-generated media asset identifier

[​](#response-extension-one-of-0)

extension

string | null

File extension without dot

Example:

`"mp4"`

[​](#response-metadata-one-of-0)

metadata

Metadata · object

Optional application-specific metadata

[​](#response-updated-at-one-of-0)

updated\_at

string<date-time> | null

Last update timestamp

Was this page helpful?

[Previous](/api/reference/media-assets/prepare-upload)[Generate a WorldStart world generation.
Creates a new world generation job and returns a long-running operation.
Poll the /operations/{operation\_id} endpoint to check generation status
and retrieve the generated world when complete.
Args:
request: The world generation request containing world\_prompt, display\_name,
tags, model, seed, and permission settings.
Returns:
GenerateWorldResponse with operation\_id and timestamps. Use the operation\_id
to poll for completion.
Raises:
HTTPException: 400 if invalid request or content violates policies
HTTPException: 402 if insufficient credits
HTTPException: 500 if generation could not be started

Next](/api/reference/worlds/generate)

⌘I

Get Media Asset

Copy

```python
curl --request GET \
  --url https://api.worldlabs.ai/marble/v1/media-assets/{media_asset_id} \
  --header 'WLT-Api-Key: <api-key>'
```

Copy

```python
{
  "created_at": "2023-11-07T05:31:56Z",
  "file_name": "<string>",
  "kind": "image",
  "media_asset_id": "<string>",
  "extension": "mp4",
  "metadata": {},
  "updated_at": "2023-11-07T05:31:56Z"
}
```

Assistant

Responses are generated using AI and may contain mistakes.

[Contact support](mailto:support@worldlabs.ai)

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/examples

## [​](#api-examples-node-&-python) API examples (Node & Python)

Minimal scripts and a simple web app for generating worlds using the raw API.
 [View on GitHub](https://github.com/worldlabsai/worldlabs-api-examples)

## [​](#client-&-splat-utilities-python) Client & splat utilities (Python)

Python client and utilities for saving/loading splats and rendering out videos.
 [View on GitHub](https://github.com/worldlabsai/worldlabs-api-python)

## [​](#spark) Spark

Render worlds on the web with SparkJS.
SparkJS is a high-performance 3D Gaussian splatting renderer built on top of THREE.js.
It is the recommended way to render World Labs splat assets in the browser.
Spark supports:

* Fast splat rendering on desktop and mobile
* Integration with other THREE.js meshes
* SPZ, PLY, SOGS, KSPLAT, and SPLAT formats
* Dynamic and procedural splat effects

 [Explore SparkJS](https://sparkjs.dev/)

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/reference/openapi

We use an OpenAPI spec to generate endpoint documentation. You can consume the
spec directly or browse API reference pages.


World API v1 OpenAPI spec

Copy

```python
components:
  schemas:
    Content:
      description: 'Represents content (media, text, images) that can be stored inline
        or via URL.


        Supports both direct data storage (up to 10MB) and URL references (up to 20MB).'
      properties:
        data_base64:
          anyOf:
          - type: string
          - type: 'null'
          title: Data Base64
        extension:
          anyOf:
          - type: string
          - type: 'null'
          description: File extension without dot
          examples:
          - jpg
          - png
          - pdf
          - txt
          title: Extension
        uri:
          anyOf:
          - type: string
          - type: 'null'
          title: Uri
      title: Content
      type: object
    DataBase64Reference:
      description: Reference to content via base64-encoded data.
      properties:
        data_base64:
          description: Base64-encoded content data
          title: Data Base64
          type: string
        extension:
          anyOf:
          - type: string
          - type: 'null'
          description: File extension without dot (e.g., 'jpg', 'png')
          title: Extension
        source:
          const: data_base64
          default: data_base64
          title: Source
          type: string
      required:
      - data_base64
      title: DataBase64Reference
      type: object
    DepthPanoPrompt:
      description: For models conditioned on a depth pano and text.
      properties:
        depth_pano_image:
          $ref: '#/components/schemas/Content'
        text_prompt:
          anyOf:
          - type: string
          - type: 'null'
          title: Text Prompt
        type:
          const: depth-pano
          default: depth-pano
          title: Type
          type: string
        z_max:
          title: Z Max
          type: number
        z_min:
          title: Z Min
          type: number
      required:
      - depth_pano_image
      - z_min
      - z_max
      title: DepthPanoPrompt
      type: object
    GenerateWorldResponse:
      description: Response from world generation endpoint.
      properties:
        created_at:
          anyOf:
          - format: date-time
            type: string
          - type: 'null'
          description: Creation timestamp
          title: Created At
        done:
          description: True if the operation is completed
          title: Done
          type: boolean
        error:
          anyOf:
          - $ref: '#/components/schemas/OperationError'
          - type: 'null'
          description: Error information if the operation failed
        expires_at:
          anyOf:
          - format: date-time
            type: string
          - type: 'null'
          description: Expiration timestamp
          title: Expires At
        metadata:
          anyOf:
          - type: object
          - type: 'null'
          description: Service-specific metadata, such as progress percentage
          title: Metadata
        operation_id:
          description: Operation identifier
          title: Operation Id
          type: string
        response:
          anyOf:
          - {}
          - type: 'null'
          description: Result payload when done=true and no error. Structure depends
            on operation type.
          title: Response
        updated_at:
          anyOf:
          - format: date-time
            type: string
          - type: 'null'
          description: Last update timestamp
          title: Updated At
      required:
      - operation_id
      - done
      title: GenerateWorldResponse
      type: object
    GetOperationResponse_World_:
      properties:
        created_at:
          anyOf:
          - format: date-time
            type: string
          - type: 'null'
          description: Creation timestamp
          title: Created At
        done:
          description: True if the operation is completed
          title: Done
          type: boolean
        error:
          anyOf:
          - $ref: '#/components/schemas/OperationError'
          - type: 'null'
          description: Error information if the operation failed
        expires_at:
          anyOf:
          - format: date-time
            type: string
          - type: 'null'
          description: Expiration timestamp
          title: Expires At
        metadata:
          anyOf:
          - type: object
          - type: 'null'
          description: Service-specific metadata, such as progress percentage
          title: Metadata
        operation_id:
          description: Operation identifier
          title: Operation Id
          type: string
        response:
          anyOf:
          - $ref: '#/components/schemas/World'
          - type: 'null'
          description: Result payload when done=true and no error. Structure depends
            on operation type.
        updated_at:
          anyOf:
          - format: date-time
            type: string
          - type: 'null'
          description: Last update timestamp
          title: Updated At
      required:
      - operation_id
      - done
      title: GetOperationResponse[World]
      type: object
    HTTPValidationError:
      properties:
        detail:
          items:
            $ref: '#/components/schemas/ValidationError'
          title: Detail
          type: array
      title: HTTPValidationError
      type: object
    ImagePrompt:
      description: 'Image-to-world generation.


        Generates a world from an image. text_prompt is optional - if not provided,

        it will be generated via recaptioning.


        Recommended image formats: jpg, jpeg, png, webp.'
      properties:
        disable_recaption:
          anyOf:
          - type: boolean
          - type: 'null'
          description: If True, use text_prompt as-is without recaptioning
          title: Disable Recaption
        image_prompt:
          description: Image content for world generation
          discriminator:
            mapping:
              data_base64: '#/components/schemas/DataBase64Reference'
              media_asset: '#/components/schemas/MediaAssetReference'
              uri: '#/components/schemas/UriReference'
            propertyName: source
          oneOf:
          - $ref: '#/components/schemas/MediaAssetReference'
          - $ref: '#/components/schemas/UriReference'
          - $ref: '#/components/schemas/DataBase64Reference'
          title: Image Prompt
        is_pano:
          anyOf:
          - type: boolean
          - type: 'null'
          description: Whether the provided image is already a panorama
          title: Is Pano
        text_prompt:
          anyOf:
          - type: string
          - type: 'null'
          description: Optional text guidance (auto-generated if not provided)
          title: Text Prompt
        type:
          const: image
          default: image
          title: Type
          type: string
      required:
      - image_prompt
      title: ImagePrompt
      type: object
    ImageryAssets:
      description: Imagery asset URLs.
      properties:
        pano_url:
          anyOf:
          - type: string
          - type: 'null'
          description: Panorama image URL
          title: Pano Url
      title: ImageryAssets
      type: object
    InpaintPanoPrompt:
      description: For models that inpaint the masked portion of a pano image.
      properties:
        pano_image:
          $ref: '#/components/schemas/Content'
        pano_mask:
          $ref: '#/components/schemas/Content'
        text_prompt:
          anyOf:
          - type: string
          - type: 'null'
          title: Text Prompt
        type:
          const: inpaint-pano
          default: inpaint-pano
          title: Type
          type: string
      required:
      - pano_image
      - pano_mask
      title: InpaintPanoPrompt
      type: object
    ListWorldsRequest:
      description: Request to list API-generated worlds with optional filters.
      examples:
      - model: Marble 0.1-plus
        page_size: 20
        sort_by: created_at
        status: SUCCEEDED
      - is_public: true
        page_size: 50
        sort_by: created_at
        status: SUCCEEDED
        tags:
        - fantasy
        - nature
      - created_after: '2024-01-01T00:00:00Z'
        created_before: '2024-12-31T23:59:59Z'
        page_size: 100
        sort_by: created_at
      - is_public: false
        model: Marble 0.1-mini
        page_size: 30
        tags:
        - landscape
      properties:
        created_after:
          anyOf:
          - format: date-time
            type: string
          - type: 'null'
          description: Filter worlds created after this timestamp (inclusive)
          title: Created After
        created_before:
          anyOf:
          - format: date-time
            type: string
          - type: 'null'
          description: Filter worlds created before this timestamp (exclusive)
          title: Created Before
        is_public:
          anyOf:
          - type: boolean
          - type: 'null'
          description: Filter by public visibility (true=public, false=private)
          title: Is Public
        model:
          anyOf:
          - enum:
            - Marble 0.1-mini
            - Marble 0.1-plus
            type: string
          - type: 'null'
          description: Filter by model used for generation
          title: Model
        page_size:
          default: 20
          description: Number of results per page (1-100)
          maximum: 100.0
          minimum: 1.0
          title: Page Size
          type: integer
        page_token:
          anyOf:
          - type: string
          - type: 'null'
          description: Cursor token for pagination (opaque base64 string from previous
            response)
          title: Page Token
        sort_by:
          default: created_at
          description: Sort results by created_at or updated_at
          enum:
          - created_at
          - updated_at
          title: Sort By
          type: string
        status:
          anyOf:
          - enum:
            - SUCCEEDED
            - PENDING
            - FAILED
            - RUNNING
            type: string
          - type: 'null'
          description: Filter by world status
          title: Status
        tags:
          anyOf:
          - items:
              type: string
            type: array
          - type: 'null'
          description: Filter by tags (returns worlds with ANY of these tags)
          title: Tags
      title: ListWorldsRequest
      type: object
    ListWorldsResponse:
      description: Response containing a list of API-generated worlds.
      properties:
        next_page_token:
          anyOf:
          - type: string
          - type: 'null'
          description: Token for fetching the next page of results
          title: Next Page Token
        worlds:
          description: List of worlds
          items:
            $ref: '#/components/schemas/World'
          title: Worlds
          type: array
      required:
      - worlds
      title: ListWorldsResponse
      type: object
    MediaAsset:
      description: 'A user-uploaded media asset stored in managed storage.


        MediaAssets can be images, videos, or binary blobs that are used

        as input to world generation.'
      properties:
        created_at:
          description: Creation timestamp
          format: date-time
          title: Created At
          type: string
        extension:
          anyOf:
          - type: string
          - type: 'null'
          description: File extension without dot
          examples:
          - mp4
          - png
          - jpg
          title: Extension
        file_name:
          description: File name
          title: File Name
          type: string
        kind:
          $ref: '#/components/schemas/MediaAssetKind'
          description: High-level media type
          examples:
          - image
          - video
        media_asset_id:
          description: Server-generated media asset identifier
          title: Media Asset Id
          type: string
        metadata:
          anyOf:
          - type: object
          - type: 'null'
          description: Optional application-specific metadata
          title: Metadata
        updated_at:
          anyOf:
          - format: date-time
            type: string
          - type: 'null'
          description: Last update timestamp
          title: Updated At
      required:
      - media_asset_id
      - file_name
      - kind
      - created_at
      title: MediaAsset
      type: object
    MediaAssetKind:
      description: High-level media asset type.
      enum:
      - image
      - video
      title: MediaAssetKind
      type: string
    MediaAssetPrepareUploadRequest:
      description: Request to prepare a media asset upload.
      properties:
        extension:
          anyOf:
          - type: string
          - type: 'null'
          description: File extension without dot
          examples:
          - mp4
          - png
          - jpg
          title: Extension
        file_name:
          description: File name
          title: File Name
          type: string
        kind:
          $ref: '#/components/schemas/MediaAssetKind'
          description: High-level media type
          examples:
          - image
          - video
        metadata:
          anyOf:
          - type: object
          - type: 'null'
          description: Optional application-specific metadata
          title: Metadata
      required:
      - file_name
      - kind
      title: MediaAssetPrepareUploadRequest
      type: object
    MediaAssetPrepareUploadResponse:
      description: Response from preparing a media asset upload.
      properties:
        media_asset:
          $ref: '#/components/schemas/MediaAsset'
          description: The created media asset
        upload_info:
          $ref: '#/components/schemas/UploadUrlInfo'
          description: Upload URL information
      required:
      - media_asset
      - upload_info
      title: MediaAssetPrepareUploadResponse
      type: object
    MediaAssetReference:
      description: Reference to a previously uploaded MediaAsset.
      properties:
        media_asset_id:
          description: ID of a MediaAsset resource previously created and marked READY
          title: Media Asset Id
          type: string
        source:
          const: media_asset
          default: media_asset
          title: Source
          type: string
      required:
      - media_asset_id
      title: MediaAssetReference
      type: object
    MeshAssets:
      description: Mesh asset URLs.
      properties:
        collider_mesh_url:
          anyOf:
          - type: string
          - type: 'null'
          description: Collider mesh URL
          title: Collider Mesh Url
      title: MeshAssets
      type: object
    OperationError:
      description: Error information for a failed operation.
      properties:
        code:
          anyOf:
          - type: integer
          - type: 'null'
          description: Error code
          title: Code
        message:
          anyOf:
          - type: string
          - type: 'null'
          description: Error message
          title: Message
      title: OperationError
      type: object
    Permission:
      description: Access control permissions for a resource.
      properties:
        allowed_readers:
          items:
            type: string
          title: Allowed Readers
          type: array
        allowed_writers:
          items:
            type: string
          title: Allowed Writers
          type: array
        public:
          default: false
          title: Public
          type: boolean
      title: Permission
      type: object
    Prompt:
      description: 'For world models generating a world from a single image (+ text).

        Images can be generated using the :image-generation method.

        If no text prompt is provided, it will be generated via recaption.'
      properties:
        image_prompt:
          $ref: '#/components/schemas/Content'
        is_pano:
          default: false
          title: Is Pano
          type: boolean
        text_prompt:
          anyOf:
          - type: string
          - type: 'null'
          title: Text Prompt
        type:
          const: image
          default: image
          title: Type
          type: string
      required:
      - image_prompt
      title: Prompt
      type: object
    SplatAssets:
      description: Gaussian splat asset URLs.
      properties:
        spz_urls:
          anyOf:
          - additionalProperties:
              type: string
            type: object
          - type: 'null'
          description: URLs for SPZ format Gaussian splat files
          title: Spz Urls
      title: SplatAssets
      type: object
    UploadUrlInfo:
      description: Information required to upload raw bytes directly to storage.
      properties:
        curl_example:
          anyOf:
          - type: string
          - type: 'null'
          description: Optional curl example for convenience
          title: Curl Example
        required_headers:
          anyOf:
          - additionalProperties:
              type: string
            type: object
          - type: 'null'
          description: Headers that MUST be included when uploading (e.g. Content-Type)
          title: Required Headers
        upload_method:
          description: Upload method
          title: Upload Method
          type: string
        upload_url:
          description: Signed URL for uploading bytes via PUT
          title: Upload Url
          type: string
      required:
      - upload_url
      - upload_method
      title: UploadUrlInfo
      type: object
    UriReference:
      description: Reference to content via a publicly accessible URL.
      properties:
        source:
          const: uri
          default: uri
          title: Source
          type: string
        uri:
          description: Publicly accessible URL pointing to the media
          title: Uri
          type: string
      required:
      - uri
      title: UriReference
      type: object
    ValidationError:
      properties:
        loc:
          items:
            anyOf:
            - type: string
            - type: integer
          title: Location
          type: array
        msg:
          title: Message
          type: string
        type:
          title: Error Type
          type: string
      required:
      - loc
      - msg
      - type
      title: ValidationError
      type: object
    World:
      description: A generated world, including asset URLs.
      properties:
        assets:
          anyOf:
          - $ref: '#/components/schemas/WorldAssets'
          - type: 'null'
          description: Generated world assets
        created_at:
          anyOf:
          - format: date-time
            type: string
          - type: 'null'
          description: Creation timestamp
          title: Created At
        display_name:
          description: Display name
          title: Display Name
          type: string
        model:
          anyOf:
          - type: string
          - type: 'null'
          description: Model used for generation
          title: Model
        permission:
          anyOf:
          - $ref: '#/components/schemas/Permission'
          - type: 'null'
          description: Access control permissions for the world
        tags:
          anyOf:
          - items:
              type: string
            type: array
          - type: 'null'
          description: Tags associated with the world
          title: Tags
        updated_at:
          anyOf:
          - format: date-time
            type: string
          - type: 'null'
          description: Last update timestamp
          title: Updated At
        world_id:
          description: World identifier
          title: World Id
          type: string
        world_marble_url:
          description: World Marble URL
          title: World Marble Url
          type: string
        world_prompt:
          anyOf:
          - discriminator:
              mapping:
                depth-pano: '#/components/schemas/DepthPanoPrompt'
                image: '#/components/schemas/Prompt'
                inpaint-pano: '#/components/schemas/InpaintPanoPrompt'
                multi-image: '#/components/schemas/MultiImagePrompt-Output'
                text: '#/components/schemas/WorldTextPrompt-Output'
                video: '#/components/schemas/VideoPrompt-Output'
              propertyName: type
            oneOf:
            - $ref: '#/components/schemas/wlt__marble__v1__schema__api_schema__WorldTextPrompt'
            - $ref: '#/components/schemas/Prompt'
            - $ref: '#/components/schemas/wlt__marble__v1__schema__api_schema__MultiImagePrompt'
            - $ref: '#/components/schemas/wlt__marble__v1__schema__api_schema__VideoPrompt'
            - $ref: '#/components/schemas/DepthPanoPrompt'
            - $ref: '#/components/schemas/InpaintPanoPrompt'
          - type: 'null'
          description: World prompt
          title: World Prompt
      required:
      - world_id
      - display_name
      - world_marble_url
      title: World
      type: object
    WorldAssets:
      description: Downloadable outputs of world generation.
      properties:
        caption:
          anyOf:
          - type: string
          - type: 'null'
          description: AI-generated description of the world
          title: Caption
        imagery:
          anyOf:
          - $ref: '#/components/schemas/ImageryAssets'
          - type: 'null'
          description: Imagery assets
        mesh:
          anyOf:
          - $ref: '#/components/schemas/MeshAssets'
          - type: 'null'
          description: Mesh assets
        splats:
          anyOf:
          - $ref: '#/components/schemas/SplatAssets'
          - type: 'null'
          description: Gaussian splat assets
        thumbnail_url:
          anyOf:
          - type: string
          - type: 'null'
          description: Thumbnail URL for the world
          title: Thumbnail Url
      title: WorldAssets
      type: object
    WorldsGenerateRequest:
      description: Request to generate a world from text, image, multi-image, or video
        input.
      examples:
      - display_name: Enchanted Forest
        model: Marble 0.1-plus
        permission:
          public: false
        seed: 42
        tags:
        - fantasy
        - nature
        world_prompt:
          text_prompt: A mystical forest with glowing mushrooms
          type: text
      - display_name: World from Image
        model: Marble 0.1-mini
        world_prompt:
          image_prompt:
            source: uri
            uri: https://example.com/my-image.jpg
          is_pano: false
          text_prompt: A beautiful landscape
          type: image
      - permission:
          public: true
        world_prompt:
          type: video
          video_prompt:
            media_asset_id: 550e8400e29b41d4a716446655440000
            source: media_asset
      - display_name: World from Multiple Images
        model: Marble 0.1-plus
        world_prompt:
          multi_image_prompt:
          - azimuth: 0
            content:
              source: uri
              uri: https://example.com/image1.jpg
          - azimuth: 180
            content:
              source: uri
              uri: https://example.com/image2.jpg
          type: multi-image
      properties:
        display_name:
          anyOf:
          - type: string
          - type: 'null'
          description: Optional display name
          title: Display Name
        model:
          default: Marble 0.1-plus
          description: The model to use for generation
          enum:
          - Marble 0.1-mini
          - Marble 0.1-plus
          title: Model
          type: string
        permission:
          $ref: '#/components/schemas/Permission'
          default:
            allowed_readers: []
            allowed_writers: []
            public: false
          description: The permission for the world
        seed:
          anyOf:
          - minimum: 0.0
            type: integer
          - type: 'null'
          description: Random seed for generation
          title: Seed
        tags:
          anyOf:
          - items:
              type: string
            type: array
          - type: 'null'
          description: Optional tags for the world
          title: Tags
        world_prompt:
          description: The prompt specifying how to generate the world
          discriminator:
            mapping:
              image: '#/components/schemas/ImagePrompt'
              multi-image: '#/components/schemas/MultiImagePrompt-Input'
              text: '#/components/schemas/WorldTextPrompt-Input'
              video: '#/components/schemas/VideoPrompt-Input'
            propertyName: type
          oneOf:
          - $ref: '#/components/schemas/wlt__marble__v1__public_api__schemas__prompts__WorldTextPrompt'
          - $ref: '#/components/schemas/ImagePrompt'
          - $ref: '#/components/schemas/wlt__marble__v1__public_api__schemas__prompts__MultiImagePrompt'
          - $ref: '#/components/schemas/wlt__marble__v1__public_api__schemas__prompts__VideoPrompt'
          title: World Prompt
      required:
      - world_prompt
      title: WorldsGenerateRequest
      type: object
    wlt__marble__v1__public_api__schemas__prompts__MultiImagePrompt:
      description: 'Multi-image-to-world generation.


        Generates a world from multiple images. text_prompt is optional.


        Recommended image formats: jpg, jpeg, png, webp.'
      properties:
        disable_recaption:
          anyOf:
          - type: boolean
          - type: 'null'
          description: If True, use text_prompt as-is without recaptioning
          title: Disable Recaption
        multi_image_prompt:
          description: List of images with optional spherical locations
          items:
            $ref: '#/components/schemas/wlt__marble__v1__public_api__schemas__prompts__SphericallyLocatedContent'
          title: Multi Image Prompt
          type: array
        reconstruct_images:
          default: false
          description: Whether to use reconstruction mode (allows up to 8 images,
            otherwise 4)
          title: Reconstruct Images
          type: boolean
        text_prompt:
          anyOf:
          - type: string
          - type: 'null'
          description: Optional text guidance (auto-generated if not provided)
          title: Text Prompt
        type:
          const: multi-image
          default: multi-image
          title: Type
          type: string
      required:
      - multi_image_prompt
      title: MultiImagePrompt
      type: object
    wlt__marble__v1__public_api__schemas__prompts__SphericallyLocatedContent:
      description: Content with a preferred location on the sphere.
      properties:
        azimuth:
          anyOf:
          - type: number
          - type: 'null'
          description: Azimuth angle in degrees
          title: Azimuth
        content:
          description: The content at this location
          discriminator:
            mapping:
              data_base64: '#/components/schemas/DataBase64Reference'
              media_asset: '#/components/schemas/MediaAssetReference'
              uri: '#/components/schemas/UriReference'
            propertyName: source
          oneOf:
          - $ref: '#/components/schemas/MediaAssetReference'
          - $ref: '#/components/schemas/UriReference'
          - $ref: '#/components/schemas/DataBase64Reference'
          title: Content
      required:
      - content
      title: SphericallyLocatedContent
      type: object
    wlt__marble__v1__public_api__schemas__prompts__VideoPrompt:
      description: 'Video-to-world generation.


        Generates a world from a video. text_prompt is optional.


        Recommended video formats: mp4, webm, mov, avi.

        Maximum video size: 100MB.'
      properties:
        disable_recaption:
          anyOf:
          - type: boolean
          - type: 'null'
          description: If True, use text_prompt as-is without recaptioning
          title: Disable Recaption
        text_prompt:
          anyOf:
          - type: string
          - type: 'null'
          description: Optional text guidance (auto-generated if not provided)
          title: Text Prompt
        type:
          const: video
          default: video
          title: Type
          type: string
        video_prompt:
          description: Video content for world generation
          discriminator:
            mapping:
              data_base64: '#/components/schemas/DataBase64Reference'
              media_asset: '#/components/schemas/MediaAssetReference'
              uri: '#/components/schemas/UriReference'
            propertyName: source
          oneOf:
          - $ref: '#/components/schemas/MediaAssetReference'
          - $ref: '#/components/schemas/UriReference'
          - $ref: '#/components/schemas/DataBase64Reference'
          title: Video Prompt
      required:
      - video_prompt
      title: VideoPrompt
      type: object
    wlt__marble__v1__public_api__schemas__prompts__WorldTextPrompt:
      description: 'Text-to-world generation.


        Generates a world from a text description. text_prompt is REQUIRED.'
      properties:
        disable_recaption:
          anyOf:
          - type: boolean
          - type: 'null'
          description: If True, use text_prompt as-is without recaptioning
          title: Disable Recaption
        text_prompt:
          anyOf:
          - type: string
          - type: 'null'
          description: Optional text guidance (auto-generated if not provided)
          title: Text Prompt
        type:
          const: text
          default: text
          title: Type
          type: string
      title: WorldTextPrompt
      type: object
    wlt__marble__v1__schema__api_schema__MultiImagePrompt:
      description: For world models supporting multi-image (+ text) input.
      properties:
        multi_image_prompt:
          items:
            $ref: '#/components/schemas/wlt__marble__v1__schema__api_schema__SphericallyLocatedContent'
          title: Multi Image Prompt
          type: array
        reconstruct_images:
          default: false
          title: Reconstruct Images
          type: boolean
        text_prompt:
          anyOf:
          - type: string
          - type: 'null'
          title: Text Prompt
        type:
          const: multi-image
          default: multi-image
          title: Type
          type: string
      required:
      - multi_image_prompt
      title: MultiImagePrompt
      type: object
    wlt__marble__v1__schema__api_schema__SphericallyLocatedContent:
      description: Content with a preferred location on the sphere.
      properties:
        azimuth:
          anyOf:
          - type: number
          - type: 'null'
          title: Azimuth
        data_base64:
          anyOf:
          - type: string
          - type: 'null'
          title: Data Base64
        extension:
          anyOf:
          - type: string
          - type: 'null'
          description: File extension without dot
          examples:
          - jpg
          - png
          - pdf
          - txt
          title: Extension
        uri:
          anyOf:
          - type: string
          - type: 'null'
          title: Uri
      title: SphericallyLocatedContent
      type: object
    wlt__marble__v1__schema__api_schema__VideoPrompt:
      description: For world models supporting video (+ text) input.
      properties:
        text_prompt:
          anyOf:
          - type: string
          - type: 'null'
          title: Text Prompt
        type:
          const: video
          default: video
          title: Type
          type: string
        video_prompt:
          $ref: '#/components/schemas/Content'
      required:
      - video_prompt
      title: VideoPrompt
      type: object
    wlt__marble__v1__schema__api_schema__WorldTextPrompt:
      description: Input prompt class for text-conditioned world generation.
      properties:
        text_prompt:
          anyOf:
          - type: string
          - type: 'null'
          title: Text Prompt
        type:
          const: text
          default: text
          title: Type
          type: string
      title: WorldTextPrompt
      type: object
  securitySchemes:
    ApiKeyAuth:
      description: API key for authentication. Get your key from the developer portal.
      in: header
      name: WLT-Api-Key
      type: apiKey
info:
  description: Public-facing API for the Marble platform
  summary: Marble Public API v1
  title: Marble Public API v1
  version: 1.0.0
openapi: 3.1.0
paths:
  /marble/v1/:
    get:
      description: Health check endpoint.
      operationId: health_check_marble_v1__get
      responses:
        '200':
          content:
            application/json:
              schema:
                title: Response Health Check Marble V1  Get
                type: object
          description: Successful Response
      summary: Health Check
  /marble/v1/media-assets/{media_asset_id}:
    get:
      description: "Get a media asset by ID.\n\nRetrieves metadata for a previously\
        \ created media asset.\n\nArgs:\n    media_asset_id: The media asset identifier.\n\
        \nReturns:\n    MediaAsset object with media_asset_id, file_name, extension,\
        \ kind,\n    metadata, created_at, and updated_at.\n\nRaises:\n    HTTPException:\
        \ 404 if not found"
      operationId: get_media_asset_marble_v1_media_assets__media_asset_id__get
      parameters:
      - in: path
        name: media_asset_id
        required: true
        schema:
          title: Media Asset Id
          type: string
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MediaAsset'
          description: Successful Response
        '422':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HTTPValidationError'
          description: Validation Error
      summary: Get Media Asset
  /marble/v1/media-assets:prepare_upload:
    post:
      description: "Prepare a media asset upload for use in world generation.\n\n\
        This API endpoint creates a media asset record and returns a signed upload\
        \ URL.\nUse this workflow to upload images or videos that you want to reference\
        \ in world\ngeneration requests.\n\n## Workflow\n\n1. **Prepare Upload** (this\
        \ endpoint): Get a `media_asset_id` and `upload_url`\n2. **Upload File**:\
        \ Use the signed URL to upload your file\n3. **Generate World**: Reference\
        \ the `media_asset_id` in `/worlds:generate` with\n   source type \"media_asset\"\
        \n\n## Request Parameters\n\n- `file_name`: Your file's name (e.g., \"landscape.jpg\"\
        )\n- `extension`: File extension without dot (e.g., \"jpg\", \"png\", \"mp4\"\
        )\n- `kind`: Either \"image\" or \"video\"\n- `metadata`: Optional custom\
        \ metadata object\n\n## Response\n\nReturns a `MediaAssetPrepareUploadResponse`\
        \ containing:\n\n- `media_asset`: Object with `media_asset_id` (use this in\
        \ world generation)\n- `upload_info`: Object with `upload_url`, `required_headers`,\
        \ and `curl_example`\n\n## Uploading Your File\n\nUse the returned `upload_url`\
        \ and `required_headers` to upload your file:\n\n```bash\ncurl --request PUT\
        \ \\\n  --url <upload_url> \\\n  --header \"Content-Type: <content-type>\"\
        \ \\\n  --header \"<header-name>: <header-value>\" \\\n  --upload-file /path/to/your/file\n\
        ```\n\nReplace:\n- `<upload_url>`: The `upload_url` from the response\n- `<content-type>`:\
        \ MIME type (e.g., `image/png`, `image/jpeg`, `video/mp4`)\n- `<header-name>:\
        \ <header-value>`: Each header from `required_headers`\n- `/path/to/your/file`:\
        \ Path to your local file\n\n## Example Usage in World Generation\n\nAfter\
        \ uploading, use the `media_asset_id` in a world generation request:\n\n```json\n\
        {\n  \"world_prompt\": {\n    \"type\": \"image\",\n    \"image_prompt\":\
        \ {\n      \"source\": \"media_asset\",\n      \"media_asset_id\": \"<your-media-asset-id>\"\
        \n    }\n  }\n}\n```"
      operationId: prepare_media_asset_upload_marble_v1_media_assets_prepare_upload_post
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MediaAssetPrepareUploadRequest'
        required: true
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MediaAssetPrepareUploadResponse'
          description: Successful Response
        '422':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HTTPValidationError'
          description: Validation Error
      summary: Prepare a media asset upload
  /marble/v1/operations/{operation_id}:
    get:
      description: "Get an operation by ID.\n\nPoll this endpoint to check the status\
        \ of a long-running operation.\nWhen done=true, the response field contains\
        \ the generated world.\n\nArgs:\n    operation_id: The operation identifier\
        \ from /worlds:generate.\n\nReturns:\n    GetOperationResponse[World] with:\n\
        \        - operation_id: Operation identifier\n        - created_at: Creation\
        \ timestamp\n        - updated_at: Last update timestamp\n        - expires_at:\
        \ Expiration timestamp\n        - done: true when complete, false while in\
        \ progress\n        - error: Error details if failed, null otherwise\n   \
        \     - metadata: Progress information and world_id\n        - response: Generated\
        \ World if done=true, null otherwise\n\nRaises:\n    HTTPException: 401 if\
        \ unauthorized\n    HTTPException: 404 if operation not found\n    HTTPException:\
        \ 500 if request fails"
      operationId: get_operation_marble_v1_operations__operation_id__get
      parameters:
      - in: path
        name: operation_id
        required: true
        schema:
          title: Operation Id
          type: string
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetOperationResponse_World_'
          description: Successful Response
        '422':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HTTPValidationError'
          description: Validation Error
      summary: Get Operation
  /marble/v1/worlds/{world_id}:
    get:
      description: "Get a world by ID.\n\nRetrieves a world's details including generated\
        \ assets if available.\nOnly the world owner or users with access to public\
        \ worlds can retrieve them.\n\nArgs:\n    world_id: The unique identifier\
        \ of the world.\n\nReturns:\n    World object with world_id, display_name,\
        \ tags, assets, created_at,\n    updated_at, permission, model, world_prompt,\
        \ and world_marble_url.\n\nRaises:\n    HTTPException: 404 if world not found\
        \ or access denied"
      operationId: get_world_marble_v1_worlds__world_id__get
      parameters:
      - in: path
        name: world_id
        required: true
        schema:
          title: World Id
          type: string
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/World'
          description: Successful Response
        '422':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HTTPValidationError'
          description: Validation Error
      summary: Get World
  /marble/v1/worlds:generate:
    post:
      description: "Start world generation.\n\nCreates a new world generation job\
        \ and returns a long-running operation.\nPoll the /operations/{operation_id}\
        \ endpoint to check generation status\nand retrieve the generated world when\
        \ complete.\n\nArgs:\n    request: The world generation request containing\
        \ world_prompt, display_name,\n        tags, model, seed, and permission settings.\n\
        \nReturns:\n    GenerateWorldResponse with operation_id and timestamps. Use\
        \ the operation_id\n    to poll for completion.\n\nRaises:\n    HTTPException:\
        \ 400 if invalid request or content violates policies\n    HTTPException:\
        \ 402 if insufficient credits\n    HTTPException: 500 if generation could\
        \ not be started"
      operationId: generate_world_marble_v1_worlds_generate_post
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WorldsGenerateRequest'
        required: true
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GenerateWorldResponse'
          description: Successful Response
        '422':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HTTPValidationError'
          description: Validation Error
      summary: Generate World
  /marble/v1/worlds:list:
    post:
      description: "List worlds with optional filters.\n\nReturns worlds created through\
        \ the API with optional filtering and pagination.\n\nArgs:\n    request: List\
        \ request with optional filters:\n        - page_size: Number of results per\
        \ page (default: 10)\n        - page_token: Pagination token from previous\
        \ response\n        - status: Filter by status (e.g., \"COMPLETED\")\n   \
        \     - model: Filter by model name (e.g., \"Marble 0.1-plus\")\n        -\
        \ tags: Filter by tags (matches worlds with any tag)\n        - is_public:\
        \ Filter by visibility (true=public, false=private, null=all)\n        - created_after:\
        \ Filter by creation time (after timestamp)\n        - created_before: Filter\
        \ by creation time (before timestamp)\n        - sort_by: Sort order (\"created_at\"\
        \ or \"updated_at\")\n\nReturns:\n    ListWorldsResponse with worlds list\
        \ and next_page_token for pagination.\n\nRaises:\n    HTTPException: 400 if\
        \ invalid parameters\n    HTTPException: 500 if request fails"
      operationId: list_worlds_marble_v1_worlds_list_post
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ListWorldsRequest'
        required: true
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ListWorldsResponse'
          description: Successful Response
        '422':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HTTPValidationError'
          description: Validation Error
      summary: List Worlds
security:
- ApiKeyAuth: []
servers:
- description: World API
  url: https://api.worldlabs.ai
```

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/marble.worldlabs.ai

404

# Page Not Found

We couldn't find the page.

---

## 🔗 Fonte: https://docs.worldlabs.ai/privacy-policy

> **Last Updated: August 12th, 2025**

This Privacy Notice describes how World Labs Technologies, Inc. (**“World Labs,”** **“we,”** or **“us”**) processes information about you. This Privacy Notice applies to information we collect when you access or use our websites (collectively, the **“Website”**), our artificial intelligence-powered world builder product (the **“Services”**), or when you otherwise interact with us, such as through our social media presence or customer support channels.
This Privacy Notice is effective as of the “Last Updated” date above. We may change this Privacy Notice from time to time. If we make changes, we will notify you by revising the “Last Updated” date. Where required by law, we will notify you of changes through the Services or by other means.

## [​](#collection-of-information) Collection of Information

### [​](#information-you-provide-to-us) Information You Provide to Us

We collect information directly from you when you create an account, request customer support, or otherwise communicate with us. The categories of information we collect include:

* **Identifiers:** we collect contact information like your name and email address.
* **Content:** we collect information contained in the content you provide in the input to the Services, including text and photos.
* **Communication Information:** we collect information included in your communications with us.

We may also collect any other information you choose to provide.

### [​](#information-we-collect-automatically) Information We Collect Automatically

We automatically collect the following categories of information:

* **Transactional Information:** we keep a history of your transactions with us, including the dates and amounts paid for the Services.
* **Internet Activity Information:** we collect information about how you access our Website, including data about the device and network you use, such as your hardware model, operating system version, mobile network, IP address, unique device identifiers, and browser type. We also collect information about your activity on our Website and interaction with our communications, such as access times, browsing behavior (such as pages viewed and links clicked), the page you visited before navigating to our Website, and information about your activity on specific pages (such as mouse movements, keystrokes, and items placed in your cart or added to your wish list).
* **Information Collected by Cookies and Similar Tracking Technologies:** we use tracking technologies, such as cookies and pixels, to collect information about your interactions with our Website and communications. These technologies help us improve our Website and communications, see which areas and features of our Website are popular, count visits, and track clicks. You may be able to adjust your browser settings to remove or reject browser cookies. Please note that removing or rejecting cookies could affect the availability and functionality of our Services.

### [​](#derived-information) Derived Information

We may derive information or draw inferences about you based on the information we collect. For example, we may make inferences about your approximate location based on your IP address.

## [​](#use-of-information) Use of Information

We use the categories of information we collect for the following business and commercial purposes:

* **Service Delivery:** we use information to provide and maintain our Services, including to process payments and authenticate your account.
* **Communication:** we use information to communicate with you about World Labs and our Services, including to respond to your questions, inform you of price or Services changes, and send you other transactional or relationship messages.
* **Marketing and Advertising:** we use information to send direct marketing messages (including via email) and target advertisements to you on third-party platforms and websites as described in the “Targeted Advertising and Analytics” section below. You can opt out of direct marketing messages we send by following the instructions in those communications (such as by clicking “unsubscribe” in the emails) or by reaching out via the “Contact Us” section below.
* **Research and Development:** we use information to monitor and analyze Website trends, usage, and activities, improve our Website and Services, develop new products and services, and generate de-identified data. Our product development and Services improvement efforts include using your Content to train our artificial intelligence models.
* **Protection and Compliance:** we use information to detect, investigate, and help prevent security incidents and other malicious, deceptive, fraudulent, or illegal activity, help protect the rights and property of World Labs and others, and comply with our legal and financial obligations.
* **Notice/Consent:** we may also use information in other circumstances after giving you notice and/or getting your consent.

## [​](#targeted-advertising-and-analytics) Targeted Advertising and Analytics

We engage others to provide analytics services, serve advertisements, and perform related services across the web and in mobile applications. These entities may use cookies, web beacons, device identifiers, and other technologies to collect information about your use of our Website, including your IP address, web browser and mobile network information, pages viewed, time spent on pages, and links clicked. This information is used to deliver advertising targeted to your interests on other companies’ sites or mobile apps and to analyze and track data, determine the popularity of certain content, and better understand your activity.
You can also learn more about interest-based ads, or opt out of having your web browsing information used for behavioral advertising purposes by companies that participate in the Digital Advertising Alliance, by visiting [www.aboutads.info/choices](http://www.aboutads.info/choices).

## [​](#disclosure-of-information) Disclosure of Information

We disclose information as follows:

* **Vendors:** we disclose information to vendors, service providers, contractors and consultants that need this information to provide services to us, such as companies that assist us with web hosting, payment processing, fraud prevention, customer service, data enrichment, analytics, and marketing and advertising.
* **Advertising Partners:** we disclose information to third parties for the purposes described in the Marketing and Advertising subsection above.
* **Professional Advisors:** we disclose information to our lawyers and other professional advisors where necessary to obtain advice or otherwise protect and manage our business interests.
* **Legal Authorities:** we may disclose information to legal authorities and others for the purposes described in the Protection and Compliance subsection above, including if we believe that disclosure is in accordance with, or required by, any applicable law or legal process, including lawful requests by public authorities to meet national security or law enforcement requirements and if we believe that your actions are inconsistent with our user agreements or policies, if we believe that you have violated the law, or if we believe it is necessary to protect the rights, property, and safety of World Labs, our users, the public, or others.
* **Corporate Transactions:** we reserve the right to disclose information in connection with or during negotiations of certain corporate transactions, including the merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.
* **Affiliates:** we reserve the right to disclose information between and among World Labs and any current or future parents, affiliates, subsidiaries, and other companies under common control and ownership.
* **Consent:** we may disclose information when we have your consent or you direct us to do so.

We also disclose de-identified information that cannot reasonably be used to identify you.

## [​](#contact-us) Contact Us

If you have any questions about this Privacy Notice, please contact us at [info@worldlabs.ai](mailto:info@worldlabs.ai).

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/export/specs

### [​](#images) Images

* **Prompt image**:
  + prompt from which the world is generated
* **360 Panorama**:
  + Equirectangular png of 2560 x 1280 pixels

### [​](#splats) Splats

* **Splats (SPZ)**:
  + Splat-based format optimized for Marble’s rendering system, about 2M splats
* **Splats (low-res SPZ)**:
  + Splat-based format optimized for Marble’s rendering system, about 500k splats
* **Splats (PLY)**:
  + Splat file with broader software compatibility, about 2M splats
* **Splats (low-res PLY)**:
  + Splat file with broader software compatibility, about 500k splats

### [​](#mesh) Mesh

* **Collider Mesh (GLB)**
  + coarse mesh optimized for simple physics calculations
  + glb format
  + 100-200k triangles
* **High-quality mesh (GLB)**
  + One glb around 600k triangles, with texture information
  + Another glb around 1M triangles, with vertex colors
  + Takes up to an hour to generate
  + Currently rate limited to 4 generation requests per hour per user
  + You can only generate high quality mesh on worlds you own

## [​](#example-files) Example files

Here we provide a few example scenes and export files to test against.

### [​](#gaussian-splats) Gaussian Splats

Scroll to the right to see all options.

| Scene | SPZ 2m | SPZ 500k | PLY 2m | PLY 500k |
| --- | --- | --- | --- | --- |
| [Rustic kitchen with natural light](https://marble.worldlabs.ai/world/69a9fc22-63ad-4e4c-9514-065b9aa56340) |  |  |  |  |
| [Elegant library with fireplace](https://marble.worldlabs.ai/world/20fc27f9-5b1f-4c76-8b22-67b866195aaf) |  |  |  |  |
| [Modern house with lush landscaping](https://marble.worldlabs.ai/world/e1d2610d-32a7-4364-acbb-8fcc97c1933d) |  |  |  |  |
| [Narrow European cobblestone lane](https://marble.worldlabs.ai/world/54fad6e4-9c9b-43ba-be6d-f1e31cbe7a95) |  |  |  |  |
| [Warm traditional kitchen interior](https://marble.worldlabs.ai/world/30ac948d-6b19-4191-a12e-4ce4510ccfe7) |  |  |  |  |

### [​](#image-&-mesh) Image & Mesh

| Scene | 360 Pano | Collider mesh GLB | HQ mesh GLB |
| --- | --- | --- | --- |
| [Rustic kitchen with natural light](https://marble.worldlabs.ai/world/69a9fc22-63ad-4e4c-9514-065b9aa56340) |  |  |  |
| [Elegant library with fireplace](https://marble.worldlabs.ai/world/20fc27f9-5b1f-4c76-8b22-67b866195aaf) |  |  |  |
| [Modern house with lush landscaping](https://marble.worldlabs.ai/world/e1d2610d-32a7-4364-acbb-8fcc97c1933d) |  |  |  |
| [Narrow European cobblestone lane](https://marble.worldlabs.ai/world/54fad6e4-9c9b-43ba-be6d-f1e31cbe7a95) |  |  |  |
| [Warm traditional kitchen interior](https://marble.worldlabs.ai/world/30ac948d-6b19-4191-a12e-4ce4510ccfe7) |  |  |  |

## [​](#faq) FAQ

### [​](#what’s-the-difference-between-spz-and-ply-formats) What’s the difference between SPZ and PLY formats?

SPZ is Marble’s native splat format optimized for file size, while PLY is a
uncompressed format compatible with more Gaussian splat software packages.

### [​](#why-are-my-splats-/-meshes-up-side-down-when-i-export-them-to-other-software) Why are my splats / meshes up-side-down when I export them to other software?

Default world labs worlds are in OpenCV coordinate system (+x left, +y down, +z forward).
Many DCC software are in the OpenGL coordinate system (+x left, -y down, -z forward).
To correct for it, perform an OpenCV-to-OpenGL transformation by scaling the Y and Z
axes by -1 (keeping X unchanged).
[See more on coordinate systems.](https://stackoverflow.com/questions/44375149/opencv-to-opengl-coordinate-system-transform)

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/support/account-billing

# [​](#subscriptions-&-billing) Subscriptions & Billing

## [​](#how-does-marble’s-pricing-work) How does Marble’s pricing work?

Marble uses a credit-based subscription system, with higher tiers unlocking more features and credits. This guide explains how the plans, credits, and feature unlocks work so you can choose the right plan for your needs.
Credits are used each time you take an action in Marble.
Our current pricing can be found [here](https://marble.worldlabs.ai/pricing).

## [​](#what-are-the-different-subscription-options) What are the different subscription options?

Marble offers four subscription tiers, each with a monthly credit allocation and access to different capabilities.

### [​](#free-plan) Free plan

Good for exploring the basics of what Marble can do

* Lightweight intro to Marble that lets you generate worlds from a text prompt, single image, or 360 panorama
* Includes up to 4 world generations

### [​](#standard-plan) Standard plan

Best for hobbyist users creating and editing worlds

* Adds creation tools for richer world building, including:
  + Generation from multiple images, videos, or 3D layouts
  + Editing your worlds
  + Exporting your worlds
  + Downloading worlds from the Marble community
* Includes up to 12 world generations

### [​](#pro-plan) Pro plan

Ideal for professional creators, artists, designers and engineers

* Unlocks advanced workflows, including:
  + Expanding worlds to larger spaces
  + Enhancing the quality of generated video outputs
  + Exporting high-quality textured meshes
  + Includes commercial rights to generated worlds
* Includes up to 25 world generations

### [​](#max-plan) Max plan

Designed for users creating at scale

* Enables high-volume production
* Includes up to 75 world generations

## [​](#do-you-offer-an-enterprise-plan) Do you offer an enterprise plan?

Yes, we offer custom plans for large teams and organizations that need flexible solutions at scale. [Contact us here](https://marble.worldlabs.ai/enterprise) to talk to our sales team.

## [​](#how-do-credits-work) How do credits work?

Credits are used each time you take an action in Marble. The number of credits used depends on the complexity of the action (see current pricing [here](https://marble.worldlabs.ai/pricing)).
For example, a basic world generation from a single image uses a combination of 1,500 “world generation” credits + 80 “input method” credits, for a total of 1,580 credits.
An advanced world generation from multiple images that is then edited twice and expanded once uses a combination of 100 “input” credits + 1,500 “world generation + (2 × 150) “edit pano” credits + 2,000 “expand world” credits, for a total of 3,900 credits.

## [​](#do-unused-credits-roll-over-how-do-i-purchase-additional-credits) Do unused credits roll over? How do I purchase additional credits?

Unused credits that come with your subscription plan (for example, the 20,000 credits that come with a Standard plan) do not roll over to the next month of your account billing cycle.
All paid plans allow you to purchase additional top-up credits at any time when you run out. Unlike credits that come with your subscription plan, top-up credits roll over to the next month. Top-up credits expire 1 year from the date of purchase.
When you take an action in Marble, your subscription credits will be used first before any top-up credits you’ve purchased are used.

## [​](#will-my-plan-automatically-renew) Will my plan automatically renew?

Yes, your plan will automatically renew at the end of your billing cycle.

## [​](#how-do-i-upgrade-my-plan) How do I upgrade my plan?

You can upgrade your plan by navigating to your Account page on the lower left of Marble, clicking “Manage account,” clicking “Manage subscription,” and selecting the plan you’d like to upgrade to.
Your upgrade will be effective immediately and you’ll have access to the new tier’s features right away.
You’ll receive a prorated refund for any unused credits from your old plan, calculated using the per credit cost of your old plan. This refund will automatically be applied to the total cost of your new plan, and you will be invoiced for the remaining balance.
For example, if you upgrade from Standard to Pro tier and currently have 5,000 credits remaining in your Standard plan, you’ll receive a refund of 5,000 × ($20/month for Standard plan ÷ 20,000 credits in Standard plan) = $5. Your upgrade cost will then become $35/month for Pro plan, less the $5 credit, for a net cost of $30.
Any top-up credits you have in your account won’t be affected and will roll over into your new plan.

## [​](#how-do-i-downgrade-my-plan) How do I downgrade my plan?

You can downgrade your plan by navigating to your Account page on the lower left corner of Marble, clicking “Manage account,” clicking “Manage subscription,” and selecting the plan you’d like to downgrade to. You’ll retain access to all the features of your old plan until the end of your billing period, at which point you’ll be downgraded to the new plan. Note that no pro-rated refund will be provided.
Any top-up credits you have in your account won’t be affected and will roll over into your new plan.

## [​](#how-do-i-cancel-my-plan) How do I cancel my plan?

You can cancel your plan by navigating to your Account page on the lower left corner of Marble, clicking “Manage account,” clicking “Manage subscription,” and clicking the “Cancel subscription” button beneath your current plan. You’ll retain access to all the features of your current plan until the end of your billing period, at which point you’ll return to the Free plan. Note that no pro-rated refund will be provided.
![Cancel subscription](https://mintcdn.com/worldlabs/oa5twLcz0KOIbnyI/images/cancelation.gif?s=0826a76477365259760645853532d593)

## [​](#how-do-i-delete-my-account) How do I delete my account?

If you wish to close your account, please reach out to [support@worldlabs.ai](mailto:support@worldlabs.ai).
![Account deletion](https://mintcdn.com/worldlabs/oa5twLcz0KOIbnyI/images/Acc_deletion.gif?s=64ab9d93078b4d9f0fc36fffb30933b7)

---

## 🔗 Fonte: https://docs.worldlabs.ai/terms-of-service

> **Last Updated: January 21, 2026**

**The following document goes into effect on January 21, 2026. Continued use of the Services on or after that date signifies your acceptance of the changes.**
Welcome to World Labs!
This Terms of Service, together with linked or referenced Supplemental Terms, exhibits, order forms, or other associated documents (collectively, “Terms of Service” or “TOS”) forms an agreement between you, either as an individual or an organization you represent (“User”, “you”, “your”, “yours”), and World Labs Technologies, Inc. (“World Labs”, “we”, “our”, “us”). Each party to this TOS may be individually referred to as “Party” or collectively “Parties”.
This TOS applies to your access to and use of: (i) the websites located at <https://www.worldlabs.ai> and <https://marble.worldlabs.ai> (or any successor links) and all associated web pages, websites, and social media pages provided by World Labs (the “Site”); and (ii) your use and access to our Services. By affirmatively consenting to use the Services (e.g., click a TOS checkbox or other mechanism as part of online registration), creating an Account, or accessing or using the Services, you acknowledge that you have read, understood, and agree to be bound by this TOS. This version of the TOS is effective as of the “Last updated date” above. Your obligations under this TOS commence as of the “Effective Date”, which is the earliest date you: (i) first access or use the Services; (ii) create an Account; or (iii) accept this TOS through click-through or other acceptance mechanism.
We may indicate that different or additional terms, conditions, guidelines, policies, or rules apply in relation to some of our Services (“Supplemental Terms”). See Section 12.5 for priority.
World Labs may revise this TOS at any time in our sole discretion. Changes become effective immediately upon posting unless otherwise specified or agreed to in writing between the Parties. For changes that materially expand the terms hereunder, we will provide advance notice as required by law. You are responsible for regularly reviewing this TOS for updates. Accessing or using the Sites or Services after a change has been made signifies your acceptance of such change. If you do not agree to the amended TOS, you must immediately stop using our Services.
There are a number of important capitalized phrases (e.g., User Content) used throughout this TOS, with specific meanings; please see the Definitions section (Section 13) to see how the phrase has been defined. If you have questions about any part of this TOS, please reach out to us via the Contact Us instructions (Section 14).
IMPORTANT: This TOS contains a binding arbitration provision and class action waiver in Section 10. Please read Section 10 carefully, as it affects your legal rights.

## [​](#1-provision-of-the-services) 1. PROVISION OF THE SERVICES

### [​](#1-1-license) 1.1. License

Unless otherwise herein provided, World Labs grants you a limited, non-exclusive, non-transferable, non-sublicensable, and revocable license to access and use the Services, including through API interfaces where available, subject to and depending on your compliance with this TOS, based on whether you have an active Order Form (including for Subscription Services, Service Credits, or Top-Up Credits), free account, or other authorized access; and the specific Services and features included with your Account. With respect to any software included in the Services, you may install and use such software solely on devices you own or control and solely in connection with your authorized use of the Services. Any use of the Services other than as specifically authorized herein, without our prior written permission, is strictly prohibited and will terminate the license granted herein and violate our intellectual property rights.

### [​](#1-2-privacy-and-security) 1.2. Privacy and Security

#### [​](#a-security-measures) a. Security Measures

World Labs shall implement and maintain network, physical, technical, and organizational Security Measures to safeguard its Systems and Services in accordance with relevant industry standards.

#### [​](#b-prohibited-processing) b. Prohibited Processing

You are prohibited on your own, or using World Labs on your behalf, from processing via the Services:

* Protected Health Information, subject to HIPAA, unless such processing is covered by a BAA executed between the Parties. If a BAA has been executed, it is herein incorporated into this TOS and has priority (in case of conflict) over this TOS, if applicable.
* Unless otherwise herein provided, Sensitive Data.

## [​](#2-service-use-and-access) 2. SERVICE USE AND ACCESS

### [​](#2-1-age-requirements) 2.1. Age Requirements

Users under 18 years of age (or the age of legal majority where you live) may not use our Services. By using the Services, you represent and warrant that you are at least 18 years of age (or the age of legal majority where you live). If we discover that a user is under the required age, we may immediately terminate their Account without notice or liability. If you are a parent or guardian and you believe that your child under the age of 18 is using our Services without your consent, please contact us via the Contact Us section.

### [​](#2-2-entity-authorization) 2.2. Entity Authorization

If you use our Services on behalf of another person or entity, (i) all references to “User”, “you”, “your”, or “yours” throughout this TOS (other than in this Section) will include that person or entity; (ii) you represent that you are authorized to accept this TOS on that person’s or entity’s behalf; and (iii) in the event you or that person or entity violates this TOS, that person or entity also agrees to be responsible to us.

### [​](#2-3-jurisdiction) 2.3. Jurisdiction

You may only use our Services in jurisdictions authorized by World Labs, as specified on our Site or in Documentation.

### [​](#2-4-authorized-users) 2.4. Authorized Users

World Labs may enable you to designate Authorized Users to use our Services, and only you or such Authorized Users may use our Services under your Account. You will be solely responsible for your Authorized Users and their activity in connection with the Services.

### [​](#2-5-electronic-communications) 2.5. Electronic Communications

You may provide certain information to World Labs in connection with your access or use of our Services, or we may collect certain information about you when you access or use our Services. You represent and warrant that any information that you provide to World Labs in connection with the Services is accurate. By using the Services, you consent to receive communications from World Labs electronically, including notices, agreements, and disclosures. You agree that all agreements, notices, and other communications provided electronically satisfy any legal requirement that such communications be in writing. For information about how we collect, use, share and otherwise process information about you, please see our Privacy Policy (accessible at <https://www.worldlabs.ai/privacy-policy>).

### [​](#2-6-accounts) 2.6. Accounts

You, and your Authorized Users (as applicable), must create an Account or link another Account, as authorized, specified, or permitted within Documentation, in order to access and use certain of the Services. You may not share or permit others to use your individual Account credentials or API Credentials. You shall promptly update any relevant information contained in your Account if it changes. You must maintain the security of your Account, as applicable, and promptly notify us if you discover or suspect that someone has accessed your Account without your permission. If applicable, you will ensure that all of your Authorized Users comply with all Account requirements set forth in this Section. We reserve the right to reclaim usernames, including on behalf of businesses or individuals that hold legal title, including trademark rights, in those usernames.

### [​](#2-7-customer-cooperation) 2.7. Customer Cooperation

You acknowledge that World Labs’ provision of the Services is dependent on your providing timely cooperation (including as needed providing access to your system, personnel, support, and materials, if reasonably required) and performing any activities as may be specified in an applicable Order Form.

### [​](#2-8-use-and-tech-restrictions) 2.8. Use and Tech Restrictions

Notwithstanding anything herein to the contrary, including the rights assignments and licenses in Section 3, you shall:

#### [​](#a-account-and-service-responsibility) a. Account and Service Responsibility

Be responsible for all use of the Services under your Account, and for obtaining and maintaining any equipment, software, or ancillary services needed to connect to, access, or use the Services;

#### [​](#b-compliance) b. Compliance

Ensure that your access to and use of the Services, and any User Content, complies with the AUP and DMCA Policy; not use the Sites or Services in violation of Applicable Law, this TOS, or World Labs’ express written authorization; be responsible for all User Content; not violate any rights of any person or entity, including any rights of publicity or privacy, intellectual property rights, or other proprietary rights, or cause injury to any person or entity; not create, post, store, or share any User Content for which you do not have all necessary rights to use or grant as herein described.

#### [​](#c-technical-restrictions) c. Technical Restrictions

Not directly or indirectly: (i) reverse-engineer, decompile, disassemble, modify, or create derivative works of the Services; (ii) probe, scan, or test the vulnerability of the Services, breach security or authentication measures without written authorization from World Labs, or willfully render any part of the Services unusable; or (iii) transfer, distribute, resell, lease, license, or assign the Services, except as expressly herein authorized or under applicable Order Forms.

#### [​](#d-competitive-restrictions) d. Competitive Restrictions

Not use or access the Services to develop competitive products or services, engage in competitive analysis or benchmarking, develop competing AI models, or develop systems that replicate the Services’ core functionality.

#### [​](#e-other-regulatory) e. Other Regulatory

Not use the Services in any way that could cause the Services or any integrated system to be classified as a “high-risk” artificial intelligence system under Applicable Law, including under Article 6(1) or Annex III of the EU AI Act.

### [​](#2-9-ai-technology-considerations) 2.9. AI Technology Considerations

#### [​](#a-ai-system-disclosure) a. AI System Disclosure

You acknowledge that the Services utilize artificial intelligence systems, including AI Models and spatial artificial intelligence technologies designed for 3D world generation and spatial intelligence applications. World Labs implements AI risk management practices consistent with industry standards.

#### [​](#b-customer-responsibility-for-regulatory-compliance) b. Customer Responsibility for Regulatory Compliance

You are responsible for ensuring your use of the Services complies with applicable AI-specific regulations in your jurisdiction, including as applicable the EU AI Act, state AI laws, and sector-specific AI regulations. You agree not to use the Services for high-risk AI applications as defined under applicable law without appropriate safeguards.

#### [​](#c-bot-disclosures) c. Bot Disclosures

To the extent the Services include automated messaging or conversational features, you acknowledge that such features are powered by artificial intelligence and are not human-operated.

### [​](#2-10-api-use-and-integration-restrictions) 2.10. API Use and Integration Restrictions

In addition to the other requirements of Section 2, when accessing the Services through APIs or integrating the Services into technology stacks:

#### [​](#a-technical-requirements) a. Technical Requirements

When accessing the Services via APIs or integrating API functionality within your technology stack or customer-facing applications, you shall: implement API integrations in accordance with World Labs’ Documentation, including proper authentication mechanisms, error handling procedures, and rate limiting compliance; comply with all rate limiting, throttling, and usage quotas established by World Labs; use only officially supported API endpoints and methods as documented by World Labs; implement enterprise-grade security measures to protect API credentials and prevent unauthorized access, including secure credential storage, network security measures, and immediate revocation capabilities for compromised credentials; maintain appropriate attribution to World Labs as specified in the API documentation; ensure that embedded API functionality does not misrepresent the source or capabilities of the underlying AI services; implement proper error handling and retry logic in accordance with World Labs’ technical specifications; maintain API version compatibility and migrate to updated versions within timeframes specified by World Labs; and not cache, store, or persist API responses beyond the duration specified in Documentation.

#### [​](#b-integration-restrictions) b. Integration Restrictions

You may not implement caching mechanisms that exceed the retention periods specified in the applicable Order Form.

#### [​](#c-violations) c. Violations

Violations of this Section 2.10 may trigger indemnification obligations under Section 7.1 and may result in immediate termination of API access.

## [​](#3-intellectual-property) 3. INTELLECTUAL PROPERTY

### [​](#3-1-world-labs-ip) 3.1. World Labs IP

World Labs exclusively retains ownership of all rights, titles, and interests in and to the World Labs Products, Services (including the text, graphics, images, photographs, videos, illustrations, software and other content contained therein), AI Models, System Data, Feedback, trademarks, its own Confidential Information, and all intellectual property rights therein and thereto, as protected under United States and foreign laws.

### [​](#3-2-world-labs-content-access-rights) 3.2. World Labs Content Access Rights

World Labs reserves the right, in its sole discretion, to charge fees for third-party access to, viewing, downloading, or other interaction with Output content displayed publicly on the World Labs Site or through the Services. This includes but is not limited to implementing premium access tiers, download fees, or subscription requirements for third-party Output viewing and retrieval.

### [​](#3-3-account-based-rights) 3.3. Account-Based Rights

#### [​](#a-free-accounts) a. Free Accounts

World Labs retains all rights in and to any Output generated by Free Account Users, excluding any portion of User Inputs incorporated into the Output. World Labs grants Free Account Users a revocable, non-exclusive, royalty-free, worldwide license to use, reproduce, modify, adapt, translate, and create derivative works from the Output solely for personal, Non-Commercial Use.

#### [​](#b-paid-accounts-and-api) b. Paid Accounts and API

Subject to the terms, conditions, and limitations of this TOS, Paid Account Users own all rights, title, and interest in and to Outputs generated through their use of the Services, excluding World Labs’ Products, technology, proprietary or Confidential Information, and intellectual property. Such Users may use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, publicly perform and display, sublicense, and exploit the Output for any purpose, including Commercial Purposes, provided that such use complies with this TOS.

#### [​](#c-conversions) c. Conversions

Output generated while an Account has Free Account status remains subject to Section 3.3(a). Output generated while an Account has Paid Account status remains subject to Sections 3.3(b) and (d). Account status is determined at the time of Output generation.

#### [​](#d-other-api-rights) d. Other API Rights

If you access the Services through API interfaces, you may use, reproduce, modify, adapt, create derivative works from, distribute, and sublicense the Output for Commercial Purposes, subject to the specific terms and limitations set forth in this TOS (including Sections 2.9 to 2.10) and applicable Order Form, including any restrictions on downstream sublicensing, attribution requirements, and usage volume limitations. For API integrations into customer-facing applications, Paid Account Users may grant end-user licenses to their Output consistent with that User’s Commercial Purpose activities. In the event of any conflict between end-user licenses and World Labs’ license-back rights, World Labs’ rights shall take precedence.

### [​](#3-4-trademarks) 3.4. Trademarks

World Labs, World Labs Marble, Marble and our logos, product or service names, slogans, and the look and feel of the Services are trademarks of World Labs and may not be copied, imitated or used, in whole or in part, without our prior written permission. All other trademarks, registered trademarks, product names, and company names or logos mentioned on or in connection with the Services are the property of their respective owners. Reference to any products, services, processes, or other information by trade name, trademark, manufacturer, supplier, or otherwise does not constitute or imply endorsement, sponsorship, or recommendation by us.

### [​](#3-5-feedback) 3.5. Feedback

You may voluntarily post, submit, or otherwise communicate to us Feedback about the Services. You recognize that we may use such Feedback for any purpose, commercial or otherwise, without acknowledgment or compensation to you, in World Labs’ sole discretion including to (a) develop, copy, publish, or improve the Feedback; or (b) improve or develop products, services, or the Services based on or using the Feedback. World Labs will exclusively own all improvements to World Labs products or services, or new World Labs products or services, based on any Feedback. You understand that Feedback does not constitute your Confidential Information.

### [​](#3-6-use-of-data) 3.6. Use of Data

Notwithstanding anything herein to the contrary, you grant World Labs a non-exclusive, royalty-free, worldwide, fully paid, and sublicensable license to collect, aggregate, use, and analyze User Content for business purposes, including further development of World Labs Products or the Services, marketing and promotions, benchmarking, or training of World Labs AI Models.
For Free Account Users, this license is irrevocable, subject to Applicable Law.
For Paid Account Users, this license is revocable, and you may opt out from World Labs’ use of your User Content, including via your Account page. Revocation applies prospectively and does not require removal of User Content from AI Models already trained prior to revocation.
For Paid Account Users, World Labs shall implement reasonable measures to:

* Use anonymized and aggregated data for model training where reasonable and technically feasible;
* Maintain industry-standard data security practices; and
* Comply with applicable data protection laws regarding automated processing

### [​](#3-7-moral-rights-and-attribution) 3.7. Moral Rights and Attribution

#### [​](#a-free-account-users) a. Free Account Users

To the fullest extent permitted by Applicable Law, Free Account Users hereby irrevocably waive any “moral rights” or other rights with respect to attribution of authorship or integrity of materials regarding Outputs generated through the Services and derivative works thereof.

#### [​](#b-paid-account-users) b. Paid Account Users

Paid Account Users retain all moral rights in Output they own under Section 3.3(b), subject to the following: (i) Paid Account Users shall not misrepresent the origin or method of creation of such Outputs; and (ii) upon World Labs’ reasonable request, Paid Account Users shall include attribution to World Labs as the service provider (e.g., “Generated using World Labs” or similar designation) in connection with public distribution or commercial exploitation of such Outputs, in a manner specified by World Labs.

#### [​](#c-user-inputs) c. User Inputs

All Users waive moral rights with respect to their Inputs processed through the Services to the extent necessary for World Labs to exercise its rights under Section 3.6, subject to applicable opt-out rights.

#### [​](#d-world-labs-attribution) d. World Labs Attribution

Users shall not remove, obscure, or alter any proprietary notices, watermarks, or attribution indicators embedded in Outputs by World Labs.

### [​](#3-8-reservation-of-rights) 3.8. Reservation of Rights

Except as expressly granted herein, the Parties reserve and retain their respective intellectual property rights and there are no other intellectual property licenses or rights, expressed, implied, or by way of estoppel, under any trademark, copyright, patent, or otherwise, granted by either Party to the other.

## [​](#4-content) 4. CONTENT

### [​](#4-1-visibility-notice) 4.1. Visibility Notice

In using the Services, you can input images, videos, information, and other materials into the Services, which will use various technologies to generate Outputs. When you input, post, or otherwise share Inputs on or through our Services, you understand that your Inputs and any associated information (such as your username or profile photo) may be visible to others. If you choose to make any of your information publicly available through the Services, you do so at your own risk.

### [​](#4-2-digital-millennium-copyright-act-compliance) 4.2. Digital Millennium Copyright Act Compliance

#### [​](#a-dmca-policy) a. DMCA Policy

In accordance with the Digital Millennium Copyright Act (“DMCA”) and other Applicable Law, we have adopted a DMCA Policy covering removal of content and/or termination, in appropriate circumstances, of the accounts of users who repeatedly infringe the intellectual property rights of others. Violations of the DMCA Policy constitute a material breach of this TOS. See our DMCA Policy for information including detailed procedures for submitting takedown notices and counter-notifications.

#### [​](#b-user-responsibility) b. User Responsibility

Users of our Services are responsible for ensuring they have appropriate rights to any Inputs processed through the Services and that generated Outputs do not infringe third-party intellectual property rights. For API users, this responsibility also extends to downstream distribution, integration into customer applications, and sublicensing of Outputs to third-parties.

### [​](#4-3-acceptable-use-policy) 4.3. Acceptable Use Policy

#### [​](#a-acceptable-use-policy) a. Acceptable Use Policy

Your use of our Services must comply with our Acceptable Use Policy. Violations of the Acceptable Use Policy constitute a material breach of this TOS.

#### [​](#b-content-moderation-authority) b. Content Moderation Authority

We do not undertake to review all User Content, and we expressly disclaim any duty or obligation to undertake any monitoring or review of any User Content. Although we have no obligation to screen, edit, or monitor User Content, we may, subject to the Acceptable Use Policy: (i) delete or remove User Content or refuse to post any User Content at any time and for any reason with or without notice, including any violations of Applicable Law or this TOS; or (ii) terminate or suspend your access to all or part of the Services, temporarily or permanently, if your User Content is reasonably likely, in our sole determination, to violate Applicable Law or this TOS; or (iii) other consequences as outlined in the Acceptable Use Policy.

#### [​](#c-enforcement-discretion) c. Enforcement Discretion

Enforcement of acceptable use standards is solely at World Labs’ discretion, and failure to enforce in some instances does not constitute a waiver of our right to enforce in other instances.

### [​](#4-4-third-party-content) 4.4. Third-Party Content

#### [​](#a-third-party-materials) a. Third-Party Materials

Our Services rely on or interoperate with Third-Party Materials. These Third-Party Materials are beyond our control, but their operation may impact, or be impacted by, the use and reliability of our Services. You acknowledge that (a) the use and availability of the Services is dependent on third-party product vendors and service providers and (b) these Third-Party Materials may not operate reliably 100% of the time, which may impact the way that our Services operate.

#### [​](#b-open-source-software) b. Open-Source Software

Specifically, certain items of independent, third-party code may be utilized in connection with the Services that may be subject to open-source licenses (“Open-Source Software”). The Open-Source Software is licensed to us under the terms of the license that accompanies such Open-Source Software and may be licensed to you under the terms of the same license or through other terms. Nothing in this TOS limits your rights under, or grants you rights that supersede, the terms and conditions of any applicable license for such Open-Source Software.

#### [​](#c-third-party-content-links) c. Third-Party Content Links

We may further provide information about or links to Third-Party Content. We provide Third-Party Content as a service to those interested in such content. Your dealings or correspondence with third-parties and your use of or interaction with any Third-Party Content are solely between you and the third-party.

#### [​](#d-no-obligation-to-monitor) d. No Obligation to Monitor

We have no obligation to monitor Third-Party Materials or Third-Party Content, and we may block or disable access to any Third-Party Materials or Third-Party Content (in whole or part) in our Sites or Services at any time. Your access to and use of such Third-Party Content or Third-Party Materials may be subject to additional terms, conditions, and policies applicable to such Third-Party Content (including terms of service or privacy policies of the providers of such Third-Party Materials or Third-Party Content).

## [​](#5-promotions-beta-products/services) 5. PROMOTIONS; BETA PRODUCTS/SERVICES

### [​](#5-1-promotions) 5.1. Promotions

Any sweepstakes, contests, raffles, surveys, games, or similar promotions (collectively, “Promotions”) made available by us, including through the Sites or Services, may be governed by rules that are separate from this TOS. If you participate in any Promotions, please review the applicable rules as well as our Privacy Policy. If the rules for a Promotion conflict with this TOS, the Promotion rules will prevail.

### [​](#5-2-beta-services/pre-ga-products) 5.2. Beta Services/Pre-GA Products

#### [​](#a-beta-services) a. Beta Services

This Section 5.2 describes the additional terms and conditions under which you may access and use certain features, technologies, and services made available to you by World Labs that are not yet generally available (each, a Pre-GA Product). You must comply with all terms related to any Pre-GA Product as posted through the Services or otherwise made available to you. World Labs may add or modify terms related to access to or use of any Pre-GA Product at any time.

#### [​](#b-conversion-termination-of-access) b. Conversion; Termination of Access

World Labs may convert any Pre-GA Product into Services at any time and, unless otherwise terminated by World Labs, your Account and access to the Pre-GA Product will convert to an ongoing account and access to the Services. Notwithstanding the foregoing, World Labs may suspend or terminate your access to or use of any Pre-GA Product at any time. Your access to and use of each Pre-GA Product will automatically terminate upon the release of a generally available version of the applicable Pre-GA Product or upon notice of termination by World Labs. Notwithstanding anything to the contrary in this TOS, after suspension or termination of your access to or use of any Pre-GA Product for any reason, (i) you will not have any further right to access or use the applicable Pre-GA Product, and (ii) any User Content used in the applicable Pre-GA Product will be handled in accordance with the data deletion procedures set forth in Section 11.

#### [​](#c-confidentiality) c. Confidentiality

Feedback and suggestions you provide to us concerning a Pre-GA Product, and any information you might receive about or involving (including the existence of) any Pre-GA Product are World Labs’ Confidential Information and you may not disclose such Feedback, suggestions or other information to any third-party.

## [​](#6-sales) 6. SALES

### [​](#6-1-general-sales) 6.1. General Sales

Certain components of the Services, including functions and rights beyond what we provide free of charge, may require Order Forms and payment. By purchasing Services with World Labs, including through our Site, the Order Form in Exhibit A applies, and you agree to the terms set forth in this Section 6.

### [​](#6-2-eligibility) 6.2. Eligibility

#### [​](#a-territory) a. Territory

To complete your purchase, you must have a valid billing address within a country that can be selected as part of the checkout process on the Site (the “Territory”). We make no promise that Services available on the Site are accessible, appropriate, or available for use in locations outside the Territory.

#### [​](#b-permitted-purchases) b. Permitted Purchases

You may only purchase Services for: (i) internal use by yourself or your Authorized Users; (ii) integration into your commercial applications and services for Commercial Purposes as defined herein; (iii) authorized reseller, partner, or other arrangements as specifically permitted in applicable Order Forms; or (iv) API access. Unauthorized resale or redistribution of Services access credentials is prohibited.

### [​](#6-3-order-forms) 6.3. Order Forms

#### [​](#a-commercial-terms) a. Commercial Terms

Specific commercial terms for Services will be set forth in separate orders, quotes, or similar ordering documents (each, an Order Form). Each Order Form must reference this TOS and be signed or otherwise executed by both Parties. Order Forms are incorporated into and made part of this TOS. In the event of a conflict between this TOS and any Order Form, the Order Form will prevail with respect to the specific Term and Services covered by that Order Form.

#### [​](#b-default-terms) b. Default Terms

For customers who access Services without executing a separate Order Form, the terms set forth in Exhibit A (Default Order Form) shall apply. Any separately executed Order Form supersedes and replaces Exhibit A for the Services covered by such Order Form.

### [​](#6-4-pricing-and-payment) 6.4. Pricing and Payment

#### [​](#a-pricing) a. Pricing

Fees, payment terms, and due dates for Services shall be as specified in the applicable Order Form, on the Pricing Page, or as shown on the Site or in the Services. Unless otherwise specified in an Order Form, all fees are quoted and payable in United States Dollars (USD) and exclude taxes, unless otherwise required by Applicable Law. For international customers, World Labs may, in its sole discretion, accept payment in other currencies at exchange rates determined by World Labs’ payment processors at the time of transaction.

#### [​](#b-fee-changes) b. Fee Changes

All fees, costs, or pricing associated with the Services (collectively, “Service Fees”) are subject to change (in World Labs’ sole discretion) at any time, may be communicated through the Pricing Page or other appropriate notice, and become effective immediately upon posting, unless otherwise specified by World Labs at the time of posting. World Labs reserves the right, in its sole discretion, to implement alternative timing mechanisms for Service Fee changes, including: (i) deferring effectiveness to users’ renewal periods following the month in which changes were posted; (ii) providing advance notice periods before implementation; (iii) grandfathering existing users at prior rates for specified periods; or (iv) implementing staged rollouts across different user segments. If you do not agree to Service Fee changes, you may cancel your Subscription Service, terminate this TOS, or otherwise close your Account.

#### [​](#c-payments) c. Payments

To make a Services-related transaction, you shall pay all charges incurred by you or on your behalf through the Services, at the prices in effect when such charges are incurred, including all taxes and any other charges applicable to your transactions. You may be required to provide payment information to us or our payment processors, including such information as payment card details, billing address, or ACH information. You agree to maintain current and valid payment method information and authorize World Labs to charge your payment method for all applicable charges. You represent and warrant that you have the right to use any submitted payment method. If World Labs cannot charge your payment method, in our sole discretion, we may (i) bill you for Services and suspend your access until payment is received; or (ii) update payment information through third-party sources and require verification prior to transaction completion.

#### [​](#d-disputes) d. Disputes

You may dispute charges in good faith by providing written notice to World Labs at [support@worldlabs.ai](mailto:support@worldlabs.ai) or [legal@worldlabs.ai](mailto:legal@worldlabs.ai) within thirty (30) days of the invoice date, specifying the basis for the dispute. World Labs will investigate disputed charges and respond within thirty (30) days. World Labs will not suspend Services for disputed amounts during the investigation period, provided you pay any undisputed portions of invoices when due. In the event legal action is necessary to collect balances due, you will reimburse us and our vendors or agents for all expenses incurred to recover sums due, including attorneys’ fees and other legal expenses.

#### [​](#e-cancellations) e. Cancellations

You may close your Account or cancel your Subscription Services at any time using the means described in your World Labs Account. Upon closing your Account or cancelling any Subscription Services: (i) no refunds will be provided for current subscription payments, unused subscription-allocated Service Credits, or purchased Top-Up Credits; (ii) automatic renewal will be disabled; (iii) any Service Credits (including Top-Up Credits) expire and are waived, effective when the Account is closed or Subscription Service cancelled; and (iv) in the case of cancelling Subscription Services, you will retain access to the Subscription Services tier through the end of your current billing period. Notwithstanding the foregoing, if you request to close your Account, your Account is deemed closed the same day as your request, no refunds will be provided, and all available Service Credits considered waived and expired.

#### [​](#f-refunds) f. Refunds

Subject to Section 6.4(e), and unless otherwise specified in an Order Form, or required by Applicable Law, all fees are non-refundable. World Labs may, in its sole discretion, provide Service Credits for documented service outages or performance issues. Service Credits, if granted, will be applied to your next invoice and cannot be refunded as cash. Any overpayments will be credited to your account or refunded at World Labs’ discretion.

#### [​](#g-taxes) g. Taxes

You are responsible for all applicable taxes, duties, and governmental charges (collectively, “Taxes”) associated with your purchase and use of Services, except as otherwise required under Applicable Law. If you are exempt from any Taxes, you must provide World Labs with appropriate tax exemption certificates. For international transactions, you’re responsible for any applicable value-added tax (VAT), goods and services tax (GST), or similar taxes in your jurisdiction.

### [​](#6-5-subscriptions) 6.5. Subscriptions

Certain Services may be offered as Subscription Services. By enrolling in Subscription Services, you authorize World Labs to charge your designated payment method automatically for recurring fees. Subscription Services will automatically renew for successive periods equal to the initial subscription term, subject to the terms and pricing in effect at the time of renewal.
AUTOMATIC RENEWAL NOTICE: Unless otherwise provided herein or on your Order Form, your Subscription Services will automatically renew at the then-current rate unless you cancel before the renewal date. You may cancel at any time through your Account settings.

### [​](#6-6-credits) 6.6. Credits

#### [​](#a-service-credits) a. Service Credits

Service Credits pricing, allocation rates, consumption costs, and expiration terms are subject to the pricing modification procedures set forth in Section 6.4(b). Users may access and use the Services through Service Credits, which may be allocated as part of their Subscription Service, purchased separately as Top-Up Credits, or purchased for API-only access as specified in Section 6.7 or an applicable Order Form. You are responsible for confirming the balance of your Service Credits, including whether the amounts of Service Credits added or deducted from your balance are accurate. Unless otherwise indicated, Service Credits are non-refundable, non-transferable (except as provided in applicable Order Forms regarding plan upgrades or conversions), and may only be used in connection with your access to and use of the Services. Service Credits are not redeemable for cash or otherwise exchangeable for any sum of monetary value. Service Credits expire on timetables provided herein, on your Order Form, or on the Pricing Page. Your Service Credit balance is not a digital wallet, stored value account, bank account, or other payment device. We reserve the right to terminate or suspend your access to Service Credits, including your Service Credit balance, in compliance with Applicable Law.

#### [​](#b-top-up-credits) b. Top-Up Credits

You may purchase additional Service Credits (“Top-Up Credits”) beyond your subscription allocation through your Account or as otherwise made available by World Labs. Subject to Section 6.4, and unless otherwise herein provided, Top-Up Credits: (i) are purchased separately from Subscription Service fees; (ii) do not expire monthly like subscription-allocated credits; (iii) remain valid for one (1) year from the date of purchase (“Top-Up Period”); (iv) carry over month-to-month during the Top-Up Period; and (v) expire automatically if unused after the Top-Up Period. Top-Up Credits are consumed after subscription-allocated credits are exhausted in any given billing period. All other terms applicable to Service Credits apply equally to Top-Up Credits. For clarity, Users whose Service Credits or Top-Up Credits have expired without renewal are considered Free Account Users.

### [​](#6-7-api-use-and-access) 6.7. API Use and Access

#### [​](#a-core-structure) a. Core Structure

Unless otherwise herein provided, API access to the Services is structured on a PAYG basis using Service Credits. API users must purchase Service Credits independently of Subscription Services to access API functionality. Initial API credit purchases require a minimum purchase amount, and additional credits may be purchased in specified increments, with all pricing, minimum purchase requirements, and increment amounts set forth on an applicable Order Form or the Pricing Page (subject to change as herein provided).

#### [​](#b-rate-limiting-and-usage) b. Rate Limiting and Usage

API access may be subject to Rate Limiting and usage quotas as specified in an Order Form, the Pricing Page, or Documentation, which may include for example: (i) maximum API calls per minute, hour, and day based on Account tier and credit balance; (ii) Concurrency Limits; (iii) data transfer volume restrictions per billing period; (iv) compute time limitations based on credit allocation; and (v) fair use enforcement mechanisms for sustained high-volume usage patterns. If applicable, Concurrency Limits are as specified in applicable Order Forms or on the Pricing Page.

#### [​](#c-credits) c. Credits

Unless otherwise specified in an applicable Order Form or on the Pricing Page, API credits expire one (1) year from the date of purchase and are consumed based on API usage. API access is contingent upon sufficient Service Credit balance, and API calls will be rejected when credit balance is insufficient.

### [​](#6-8-reservation-of-rights) 6.8. Reservation of Rights

World Labs reserves the right to modify pricing, discontinue Services, refuse service to any customer, reject any order, alter payment options, and limit available purchases, subject to limitations set forth in applicable Order Forms.

## [​](#7-indemnification) 7. INDEMNIFICATION

### [​](#7-1-user-indemnification) 7.1. User Indemnification

To the fullest extent permitted by Applicable Law, you will indemnify, defend, and hold harmless World Labs, our affiliates, and our respective officers, directors, agents, partners, and employees (individually and collectively, the “World Labs Parties”) from and against any losses, liabilities, claims, demands, damages, expenses or costs (“Indemnity Claims”) arising out of or related to (a) your access to or use of the Services, including through API interfaces; (b) your User Content or Feedback; (c) your violation of this TOS, including API restrictions under Section 2; (d) your violation, misappropriation, or infringement of any rights of another (including intellectual property rights or privacy rights); (e) any security incidents arising from your failure to implement required API key management and security procedures under Section 2; or (f) your conduct in connection with the Services, including any downstream use or distribution of API-generated Outputs. You will promptly notify World Labs Parties of any third-party Indemnity Claims, cooperate with World Labs Parties in defending such Indemnity Claims, and pay all fees, costs, and expenses associated with defending such Indemnity Claims (including attorneys’ fees). The World Labs Parties will have control of the defense or settlement, at World Labs’ sole option, of any third-party Indemnity Claims. This indemnity is in addition to, and not in lieu of, any other indemnities set forth in a written agreement between you and World Labs or the other World Labs Parties.

## [​](#8-representations-warranties-disclaimers) 8. REPRESENTATIONS, WARRANTIES, DISCLAIMERS

### [​](#8-1-representations-and-warranties) 8.1. Representations and Warranties

#### [​](#a-both-parties) a. Both Parties

Each Party represents and warrants that: (i) it has the full right, power, and authority to enter into this TOS, to grant the rights and licenses granted hereunder, and to perform its obligations hereunder; and (ii) when executed, this TOS will constitute the legal, valid, and binding obligations of both Parties, enforceable against both Parties in accordance with its terms.

#### [​](#b-user) b. User

You warrant that: (i) if you are an organization, company, or entity, you are duly organized, validly existing, and in good standing as a corporation or other entity as represented herein under the laws and regulations of your jurisdiction of incorporation, organization, or chartering; (ii) if you are an organization, company, or entity, the signatory of any Order Form or other document executed on your behalf will be duly authorized by any necessary corporate action to act for you in such capacity; (iii) you have all the necessary rights and consents to provide to World Labs, process within the Services, and permit World Labs to use (as provided in this TOS) any User Content; and (iv) for API use and access, you warrant that your use or integration of API-related Services will comply with the requirements in this TOS and applicable Documentation.

### [​](#8-2-disclaimers) 8.2. Disclaimers

#### [​](#a-general-warranty-disclaimers) a. General Warranty Disclaimers

EXCEPT AS EXPRESSLY SET FORTH HEREIN, WORLD LABS DISCLAIMS ALL WARRANTIES WITH RESPECT TO THE SERVICES, OUTPUTS, AND ANY CONTENT OR MATERIALS PROVIDED THEREIN OR THEREWITH, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. THE SERVICES AND ALL CONTENT ARE PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND.

#### [​](#b-ai-and-tech-specific-disclaimers) b. AI and Tech-Specific Disclaimers

YOU ACKNOWLEDGE AND AGREE THAT YOUR USE OF AI-GENERATED OUTPUTS IS ENTIRELY AT YOUR OWN RISK. WORLD LABS MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT SUCH OUTPUT. YOU FURTHER ACKNOWLEDGE AND AGREE THAT:
**OUTPUT LIMITATIONS:** THE SERVICES MAY GENERATE OUTPUT CONTAINING INCORRECT, BIASED, INCOMPLETE, OR TECHNICALLY INACCURATE INFORMATION. AI-GENERATED 3D WORLDS AND SPATIAL CONTENT MAY NOT ACCURATELY REPRESENT REAL-WORLD PHYSICS, DIMENSIONS, OR SPATIAL RELATIONSHIPS.
**PROFESSIONAL ADVICE DISCLAIMER:** THE INSIGHTS AND OUTPUTS PROVIDED BY THE SERVICES DO NOT CONSTITUTE PROFESSIONAL ADVICE, COUNSEL, OR RECOMMENDATIONS FOR ANY SPECIFIC USE CASE OR APPLICATION.
**AUTOMATED DECISION-MAKING LIMITATIONS:** THE SERVICES ARE NOT DESIGNED, INTENDED, OR SUITABLE FOR AUTOMATED DECISION-MAKING WITH LEGAL OR SIMILARLY SIGNIFICANT EFFECTS. WORLD LABS EXPLICITLY DISCLAIMS ANY REPRESENTATIONS REGARDING THE SUITABILITY OF OUTPUTS FOR AUTOMATED DECISION-MAKING PURPOSES. IF YOU USE OUTPUTS FOR AUTOMATED DECISION-MAKING DESPITE THESE LIMITATIONS, YOU ASSUME FULL RESPONSIBILITY FOR YOUR COMPLIANCE WITH ALL APPLICABLE LAW.
**ALGORITHMIC TRANSPARENCY:** WORLD LABS DOES NOT PROVIDE ALGORITHMIC EXPLAINABILITY OR DETAILED REASONING FOR AI-GENERATED OUTPUTS. THE UNDERLYING AI MODELS OPERATE AS “BLACK BOX” SYSTEMS WITH LIMITED INTERPRETABILITY.
**BIAS AND FAIRNESS:** WORLD LABS DOES NOT WARRANT THAT AI OUTPUTS ARE FREE FROM BIAS, DISCRIMINATION, OR UNFAIR TREATMENT OF PROTECTED CHARACTERISTICS. USERS ARE RESPONSIBLE FOR IMPLEMENTING BIAS TESTING AND FAIRNESS EVALUATIONS APPROPRIATE FOR THEIR USE CASES.
**REGULATORY CLASSIFICATION:** WORLD LABS CLASSIFIES ITS SERVICES, INCLUDING FOR EU AI ACT PURPOSES, AS LIMITED RISK AI SYSTEMS. USERS USING THE SERVICES IN HIGH-RISK APPLICATIONS ASSUME FULL RESPONSIBILITY FOR COMPLIANCE WITH APPLICABLE HIGH-RISK AI SYSTEM REQUIREMENTS.
**THIRD-PARTY INFRINGEMENT:** WORLD LABS HAS NO RESPONSIBILITY FOR THIRD-PARTY INTELLECTUAL PROPERTY INFRINGEMENT CLAIMS RELATED TO YOUR USE OF AI-GENERATED OUTPUTS.
**JURISDICTIONAL VARIATIONS:** THESE DISCLAIMERS APPLY TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW IN YOUR JURISDICTION. ADDITIONAL REGULATORY OBLIGATIONS MAY APPLY BASED ON YOUR LOCATION AND USE CASE.

#### [​](#c-beta-and-pre-ga-products) c. Beta and Pre-GA Products

WORLD LABS MAY OFFER PRE-GA PRODUCTS TO USERS ON A VOLUNTARY USE BASIS; SUCH PRODUCTS ARE NOT SUITABLE FOR PRODUCTION USE AND ARE PROVIDED “AS-IS” ON A TEMPORARY BASIS. FOR PRE-GA PRODUCTS, WORLD LABS PROVIDES NO INDEMNITIES; SERVICE-LEVEL COMMITMENTS; REPRESENTATIONS OR WARRANTIES (EXPRESS OR IMPLIED), INCLUDING WARRANTIES OF MERCHANTABILITY, TITLE, NON-INFRINGEMENT, OR FITNESS FOR ANY PARTICULAR PURPOSE. ACCORDINGLY, USER’S ACCESS TO AND USE OF A PRE-GA PRODUCT IS ENTIRELY AT USER’S OWN RISK. USER ASSUMES ALL RISK AND RESPONSIBILITY WITH RESPECT THERETO. IN NO EVENT WILL WORLD LABS BE LIABLE FOR ANY SUCH USE OR DAMAGES WHATSOEVER ARISING OUT OF OR RELATED TO THE USE OF OR ACCESS TO PRE-GA PRODUCTS. USER IS HEREBY ADVISED TO SAFEGUARD IMPORTANT DATA, USE CAUTION WHEN ACCESSING OR USING PRE-GA PRODUCTS, AND NOT TO RELY ON IN ANY WAY THE CORRECT FUNCTIONING OR PERFORMANCE OF ANY PRE-GA PRODUCT.

#### [​](#d-service-reliability) d. Service Reliability

WORLD LABS DOES NOT REPRESENT OR WARRANT THAT OUR SERVICES OR ANY CONTENT PROVIDED THEREIN OR THEREWITH (INCLUDING THIRD-PARTY CONTENT AND THIRD-PARTY MATERIALS) ARE ACCURATE, COMPLETE, RELIABLE, CURRENT, ERROR-FREE, FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS; OR THAT ACCESS TO OUR SERVICES OR ANY CONTENT PROVIDED THEREIN OR THEREWITH (INCLUDING THIRD-PARTY CONTENT AND THIRD-PARTY MATERIALS) WILL BE UNINTERRUPTED.

#### [​](#e-third-party-materials) e. Third-Party Materials

WORLD LABS IS NOT RESPONSIBLE FOR ANY NON-WORLD LABS PRODUCTS, THIRD-PARTY CONTENT, OR INTEGRATIONS, DOES NOT GUARANTEE THEIR CONTINUED AVAILABILITY, AND MAY CEASE MAKING INTEGRATIONS AVAILABLE IN WORLD LABS’ SOLE DISCRETION.

#### [​](#f-user-content) f. User Content

WORLD LABS IS NOT RESPONSIBLE FOR ANY CONTENT THAT YOU, OTHER USERS, OR THIRD-PARTIES CREATE, UPLOAD, POST, SEND, RECEIVE, OR STORE ON OR THROUGH THE SERVICES.

#### [​](#g-beneficiaries) g. Beneficiaries

ALL DISCLAIMERS ARE MADE FOR THE BENEFIT OF WORLD LABS, WORLD LABS PARTIES, AND WORLD LABS’ RESPECTIVE SHAREHOLDERS, AGENTS, REPRESENTATIVES, LICENSORS, AFFILIATES, SUPPLIERS, AND SERVICE PROVIDERS, AS WELL AS THEIR RESPECTIVE SUCCESSORS AND ASSIGNS.

#### [​](#h-risk-allocation) h. Risk Allocation

UNLESS OTHERWISE HEREIN PROVIDED, YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK. YOU ASSUME THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SERVICES AND ALL CONTENT PROVIDED THEREIN.

## [​](#9-limitations-of-liability-releases) 9. LIMITATIONS OF LIABILITY; RELEASES

### [​](#9-1-liability-limits) 9.1. Liability Limits

UNDER NO LEGAL THEORY, WHETHER IN TORT, CONTRACT, OR OTHERWISE, WILL WORLD LABS OR THE WORLD LABS PARTIES BE LIABLE TO YOU UNDER THIS TOS FOR (A) ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES OF ANY CHARACTER, INCLUDING DAMAGES FOR LOSS OF GOODWILL, LOST PROFITS, LOST SALES OR BUSINESS, WORK STOPPAGE, COMPUTER FAILURE OR MALFUNCTION, OR LOST CONTENT OR DATA, EVEN IF A REPRESENTATIVE OF SUCH PARTY HAS BEEN ADVISED, KNEW, OR SHOULD HAVE KNOWN OF THE POSSIBILITY OF SUCH DAMAGES, OR (B) EXCLUDING USER’S PAYMENT OBLIGATIONS, ANY AGGREGATE DAMAGES, COSTS, OR LIABILITIES IN EXCESS OF THE GREATER OF (i) ONE HUNDRED (100) DOLLARS OR (II) THE AMOUNTS PAID BY USER UNDER THE APPLICABLE ORDER FORM(S) DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM. THE LIMITATIONS SET FORTH IN THIS SECTION WILL NOT LIMIT OR EXCLUDE LIABILITY FOR THE GROSS NEGLIGENCE, FRAUD, OR INTENTIONAL MISCONDUCT OF WORLD LABS OR THE OTHER WORLD LABS PARTIES OR FOR ANY OTHER MATTERS IN WHICH LIABILITY CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.

### [​](#9-2-releases) 9.2. Releases

To the fullest extent permitted by Applicable Law, you release World Labs and the other World Labs Parties from responsibility, liability, claims, demands, and/or damages (actual and consequential) of every kind and nature, known and unknown (including claims of negligence), arising out of or related to disputes between Users and the acts or omissions of third-parties. If you are a consumer who resides in California, you hereby waive your rights under California Civil Code § 1542, which provides: “A general release does not extend to claims that the creditor or releasing party does not know or suspect to exist in his or her favor at the time of executing the release and that, if known by him or her, would have materially affected his or her settlement with the debtor or released party.”

## [​](#10-dispute-resolution-binding-arbitration) 10. DISPUTE RESOLUTION; BINDING ARBITRATION

PLEASE READ THIS SECTION CAREFULLY. THESE SECTION 10 TERMS CONTAIN A BINDING, INDIVIDUAL ARBITRATION REQUIREMENT AND CLASS-ACTION WAIVER, WHICH MEANS YOU AND WORLD LABS AGREE TO RESOLVE MOST DISPUTES IN BINDING, INDIVIDUAL ARBITRATION AND NOT BY MEANS OF A CLASS ARBITRATION, A CLASS ACTION, ANY OTHER KIND OF REPRESENTATIVE PROCEEDING, OR A JURY TRIAL. THIS SECTION LIMITS THE REMEDIES AVAILABLE TO YOU IN THE EVENT OF A DISPUTE. YOU MAY OPT OUT WITHIN 30 DAYS BY EMAILING [LEGAL@WORLDLABS.AI](mailto:LEGAL@WORLDLABS.AI) WITH YOUR FULL NAME, ADDRESS, AND CLEAR INTENT TO OPT OUT.

### [​](#10-1-agreement-to-arbitrate) 10.1. Agreement to Arbitrate

You and World Labs agree to resolve disputes through binding individual arbitration, not in court or through class actions.
A “Claim” means any dispute, claim, or controversy (excluding small claims court cases and intellectual property disputes as specified below) between you and World Labs, whether based in contract, tort, statute, fraud, misrepresentation, or any other legal theory, that either party wishes to seek legal recourse for and that arises from or relates to this TOS or the Services, including any privacy or data security claims or claims related to the validity, enforceability, or scope of this arbitration requirement or any portion of it. Exceptions: The following types of Claims are not subject to arbitration: (i) individual Claims brought in small claims court, so long as the matter remains in such court and advances only on an individual (non-class, non-representative) basis; (ii) any claim exclusively related to intellectual property and related rights of you or World Labs, including disputes over injunctive or other equitable relief to stop unauthorized use of intellectual property (“IP Claims”).

### [​](#10-2-what-this-means) 10.2. What This Means

* **No Jury Trials:** Neither party can demand a jury trial.
* **No Class Actions or Representative Proceedings:** You cannot join a class action lawsuit, class arbitration, or participate as a plaintiff or class member in any purported representative proceeding.
* **Individual Basis Only:** Each dispute is resolved separately.
* **Binding Decision:** The arbitrator’s decision is final and binding.

### [​](#10-3-required-steps-before-arbitration) 10.3. Required Steps Before Arbitration

**Step 1 - Informal Resolution:** Before filing for arbitration, either User may send a written notice to [legal@worldlabs.ai](mailto:legal@worldlabs.ai), or World Labs may send a written notice to User at the email or other address on record, in either case describing the dispute and desired resolution (“Claimant Notice”). The Parties shall attempt good faith negotiations for 30 days (“Informal Resolution Period”) from receipt of the Claimant Notice. If you or World Labs file a Claim in court or proceed to arbitration without providing a compliant Claimant Notice and waiting until the conclusion of the Informal Resolution Period, the other party reserves the right to seek relief from a court to enjoin the filing and seek damages from the Party that has not followed the informal resolution process to reimburse it for any arbitration fees and costs already incurred as a foreseeable consequence of that breach.
**Step 2 - Arbitration Filing:** If informal resolution fails, either party may file for arbitration with National Arbitration and Mediation (“NAM”) at namadr.com. If NAM notifies the Parties in writing (email suffices) that it is not available to arbitrate any Claim, then that Claim may only be settled by binding individual arbitration conducted by American Arbitration Association (“AAA”). For Claims that must be arbitrated by AAA, if you are a “Consumer,” meaning that you only use the Services for personal, family or household purposes, the then-current version of the AAA’s Consumer Arbitration Rules apply as modified by this TOS. If you are not a Consumer, the then-current version of the AAA’s Commercial Arbitration Rules and Mediation Procedures apply.

### [​](#10-4-arbitration-procedures) 10.4. Arbitration Procedures

* **Single Arbitrator:** One neutral arbitrator decides the case whose decision will be final and binding.
* **Hearing Format:**
  + Claims under $10,000: Written submissions only (unless arbitrator requires hearing).
  + Claims $10,000+: Video/phone hearing (in-person if arbitrator determines necessary).
* **Location:** If in-person hearing required, San Francisco County, CA, unless this would pose a substantial hardship for you, in which case the hearing may be conducted in your state and county of residence.
* **Language:** English.
* **Decision:** Written decision with reasoning required. The arbitrator must provide a reasoned written decision sufficient to explain the essential findings and conclusions on which the decision and award, if any, are based.
* **Enforcement:** Judgment on the arbitration decision may be entered in any court having jurisdiction thereof.
* **Discovery:** Discovery will be permitted pursuant to the applicable Rules. However, discovery may be limited by the arbitrator if the arbitrator determines that the discovery sought is excessive given the amount in controversy or the complexity of the issues.
* **Confidentiality:** If you or World Labs submits a Claim to arbitration, you and World Labs agree to cooperate to seek from the arbitrator protection for any confidential, proprietary, trade secret, or otherwise sensitive information, documents, testimony, and other materials that might be exchanged or the subject of discovery in the arbitration.

### [​](#10-5-arbitrator-authority-and-limitations) 10.5. Arbitrator Authority and Limitations

To the fullest extent allowed by Applicable Law, the arbitrator may only award legal or equitable remedies that are individual to you or World Labs to satisfy one of the individual Claims (that the arbitrator determines are supported by credible relevant evidence). The arbitrator will not have the authority to award punitive or exemplary damages, except where permitted by statute, and each party hereby waives its right to recover punitive or exemplary damages with respect to such Claims. The arbitrator cannot award relief benefiting persons other than the Parties to the arbitration.

### [​](#10-6-costs-and-fees) 10.6. Costs and Fees

Each Party pays its own arbitration fees per applicable rules. To the extent permitted by Applicable Law, a claimant must pay all costs incurred by the defending party, including any attorney’s fees, related to a Claim if an arbitrator determines that (i) the Claim was not warranted by existing law or by a nonfrivolous argument or (ii) the Claim was filed in arbitration for any improper purpose, such as to harass the defending party, cause unnecessary delay, or needlessly increase the cost of dispute resolution.
**Settlement Offers:** If a party rejects the latest written settlement offer and the final arbitration award is less favorable than the rejected offer, that party must pay all costs and fees (including arbitration, attorney, and expert fees) incurred by the other party after the settlement offer was made.

### [​](#10-7-mass-claims-process) 10.7. Mass Claims Process

If 25 or more Claimant Notices are received by a party that raise similar claims and have the same or coordinated counsel, these will be considered “Coordinated Claims.”

* **Bellwether Process:** After that point, counsel for the Parties shall select 20 Coordinated Claims to proceed in arbitration as a bellwether to allow each side to test the merits of its arguments. Each side shall select 10 claimants who have provided compliant Claimant Notices for this purpose, and only those chosen cases may be filed with the arbitration provider. The entire bellwether process, including mediation, must be completed within 18 months of the first claim notice, unless Parties agree in writing to extend this deadline.
* **Mediation:** After initial arbitrations conclude (or sooner if the claimants and the other party agree), Parties must engage in good faith mediation of all remaining Coordinated Claims, with World Labs paying the mediator’s fee.
* **Court Authority:** A court shall have authority to enforce the bellwether and mediation processes defined in this section and may enjoin the filing of lawsuits or arbitration demands not made in compliance with it. If Coordinated Claims released from the arbitration requirement are brought in court, claimants may seek class treatment, but to the fullest extent allowed by Applicable Law, the classes sought may comprise only the claimants in Coordinated Claims for which a compliant Claimant Notice was received by the other party.
* **Impracticability Waiver:** To the extent you are asserting the same Claim as other persons and are represented by common or coordinated counsel, you agree to waive any objection that the joinder of all such persons is impracticable.

### [​](#10-8-time-limit-and-tolling) 10.8. Time Limit and Tolling

All claims must be filed within one year of when they arise, or they are permanently barred. The statute of limitations and any filing fee deadlines for a Claim shall be tolled for the duration of the Informal Resolution Period for that Claim so that the Parties can engage in this informal dispute-resolution process. Applicable statutes of limitations will be tolled for Claims asserted in Coordinated Claims from the time a compliant Claimant Notice has been received by a party until this TOS permits such Coordinated Claim to be filed in arbitration or court.

### [​](#10-9-opt-out-right) 10.9. Opt-Out Right

You may opt out of this arbitration requirement by emailing [legal@worldlabs.ai](mailto:legal@worldlabs.ai) within thirty (30) days of the later of: (i) the date you first accepted this TOS; or (ii) the date you first had notice of this arbitration agreement. Include your full name, mailing address, email, and clear statement opting out of arbitration. If you opt out, World Labs will also not be bound by this arbitration agreement as to you.

### [​](#10-10-changes-to-this-section) 10.10. Changes to This Section

You may reject any change we make to this arbitration Section 10 (except address changes) by emailing [legal@worldlabs.ai](mailto:legal@worldlabs.ai) within 30 days of the change. Changes to this arbitration section may only be rejected as a whole, and you may not reject only certain changes. If you reject the change, your Account will be governed by the arbitration terms that were in place immediately before the rejected change.

### [​](#10-11-if-part-of-this-section-is-invalid) 10.11. If Part of This Section Is Invalid

If a court decides that Applicable Law precludes enforcement of any of this Section 10’s limitations as to a particular Claim for relief, then that Claim (and only that Claim) must be severed from the arbitration and may be brought in court. If a court decides that the limitation of liability provisions in this TOS are not enforceable as to a particular Claim, then the agreement to arbitrate will not apply to that Claim. If any part of this arbitration section is found unenforceable, that part is removed but the rest remains in effect. If class or representative claims must proceed, they go to court while individual claims remain in arbitration.

### [​](#10-12-international-users) 10.12. International Users

If you live outside the United States, you may choose arbitration under this section or pursue dispute resolution in your home jurisdiction according to the dispute resolution process set forth under the law of your country of residence or other jurisdiction as permitted by local law.

### [​](#10-13-governing-law-venue-and-survival) 10.13. Governing Law, Venue, and Survival

This arbitration agreement is made pursuant to a transaction involving interstate commerce, and shall be governed by the Federal Arbitration Act (“FAA”), 9 U.S.C. §§ 1-16, and California law. Any court proceedings (if permitted) occur in San Francisco County, California. This Section 10 will survive any termination of your relationship with World Labs.

## [​](#11-term-and-termination) 11. TERM AND TERMINATION

### [​](#11-1-term) 11.1. Term

This TOS will commence as of the Effective Date and continue until the earlier of: (i) the expiration or termination of all applicable Order Forms; (ii) closure of your Account; or (iii) other termination of this TOS. Individual Order Forms will have their own terms as specified therein and will terminate upon expiration of their stated term or termination of this TOS, whichever occurs first.

### [​](#11-2-termination-for-convenience) 11.2. Termination for Convenience

#### [​](#a-world-labs-termination-for-convenience) a. World Labs Termination for Convenience

World Labs may terminate this TOS, any applicable Order Form, or individual Accounts for convenience at any time. Upon such termination by World Labs: (i) Users with Paid Accounts will retain access through the end of their current billing period; and (ii) World Labs will provide a pro rata refund of any prepaid fees for the unused portion of the then-current billing period.

#### [​](#b-user-termination-for-convenience) b. User Termination for Convenience

You may terminate this TOS, any applicable Order Form, or close your Account for convenience at any time without advance notice. Upon such termination, no refunds will be provided for prepaid fees, unused Service Credits, or Top-Up Credits.

### [​](#11-3-termination-for-material-breach-or-corporate-changes) 11.3. Termination for Material Breach or Corporate Changes

Either Party may terminate this TOS or any applicable Order Form effective immediately if the other Party (“Breaching Party”): (i) materially breaches this TOS or an applicable Order Form and fails to cure such breach within thirty (30) days after receiving written notice of the breach (provided that breaches involving security violations, illegal activity, or intellectual property infringement may be terminated immediately without cure period); (ii) repeatedly breaches this TOS or any applicable Order Form regardless of cure; (iii) becomes insolvent; (iv) files, or has filed against it, a petition for voluntary or involuntary bankruptcy or otherwise becomes subject, voluntarily or involuntarily, to any proceeding under any domestic or foreign bankruptcy or insolvency law; (v) makes or seeks to make a general assignment for the benefit of its creditors; or (vi) applies for or has appointed a receiver, trustee, custodian, or similar agent appointed by order of any court of competent jurisdiction to take charge of or sell any material portion of its property or business. Upon termination under this Section 11.3, the Breaching Party will not be entitled to refunds for prepaid fees, unused Service Credits, or Top-Up Credits. Notwithstanding the foregoing, if World Labs is the Breaching Party, World Labs will provide a pro rata refund of prepaid fees for the unused portion of the then-current billing period.

### [​](#11-4-data-deletion) 11.4. Data Deletion

Upon termination or expiration of this TOS or your Account, your Account will be deemed closed and access removed promptly following the request, unless otherwise specified by World Labs. After the term, World Labs has no obligation to maintain or provide you access to any User Content (except as required under Applicable Law) and, unless legally prohibited, may delete your User Content.

### [​](#11-5-survival) 11.5. Survival

Any rights, obligations, or required performance of the Parties under this TOS which, by their express terms or nature and context are intended to survive termination or expiration of this TOS, will survive any such termination or expiration, including the rights and obligations set forth around Intellectual Property, Confidentiality, Indemnification, Representations, Warranties, Disclaimers, Limitations of Liability, Releases, Dispute Resolution, and General, together with any accrued payment obligations.

## [​](#12-general) 12. GENERAL

### [​](#12-1-entire-agreement) 12.1. Entire Agreement

This TOS comprises the entire agreement between the Parties with respect to its subject matter and supersedes all prior and contemporaneous proposals, statements, sales materials or presentations, and agreements, both oral and written. No oral or written information or advice given by World Labs creates any warranty or in any way increases the scope of the warranties in this TOS.

### [​](#12-2-modifying-services) 12.2. Modifying Services

We reserve the right to modify our Services or to suspend or terminate providing all or part of our Services at any time; charge, modify, or waive any fees required to use the Services; or offer opportunities to some or all end users of the Services. All modifications and additions to the Services will be governed by this TOS, applicable Order Form, or the Supplemental Terms, unless otherwise expressly stated by World Labs in writing. We are not responsible for any loss or harm related to your inability to access or use our Services per this Section or Section 11.

### [​](#12-3-relationship-of-the-parties) 12.3. Relationship of the Parties

Nothing in this TOS constitutes or evidences any partnership, joint venture, employment, or agency relationship between the Parties.

### [​](#12-4-no-third-party-beneficiaries) 12.4. No Third-Party Beneficiaries

This TOS is solely between the Parties and does not confer any rights or remedies to any person or entity except as may be expressly provided herein.

### [​](#12-5-priority) 12.5. Priority

In the event of conflict between documents, the order of precedence shall be: (1) the applicable Order Form; (2) Supplemental Terms; (3) Acceptable Use Policy; (4) DMCA Policy; and (5) this TOS.

### [​](#12-6-insurance) 12.6. Insurance

During the term of this TOS, World Labs will maintain, at its own cost, appropriate insurance coverages in amounts that are commercially reasonable to secure its obligations to you under this TOS.

### [​](#12-7-assignment) 12.7. Assignment

You will not have the right or ability to assign or subcontract any rights or obligations under this TOS without the prior written consent of World Labs. World Labs may assign or transfer this TOS without your consent. Either Party may assign or transfer this TOS without the other Party’s prior written consent to the Party’s affiliates or subsidiaries, or in connection with a restructuring, merger, or consolidation, or sale of all or substantially all of such Party’s assets. Any attempted assignment in violation of this TOS will be void and without effect.

### [​](#12-8-amendment-waiver) 12.8. Amendment; Waiver

World Labs may amend or modify this TOS at any time in its sole discretion as provided herein. Any amendment of, waiver of rights under, or modification of this TOS by User must be in writing and signed by both Parties. Failure or delay by either Party to enforce any provision of this TOS will not be deemed a waiver of future enforcement of that or any other provision.

### [​](#12-9-equitable-relief) 12.9. Equitable Relief

The Parties acknowledge that a breach of this TOS may result in irreparable and continuing harm for which no adequate remedy at law exists, and that the non-breaching Party will be entitled to seek injunctive relief, a decree for specific performance, and/or such other equitable relief as may be appropriate. Nothing herein limits either Party’s right to seek monetary damages.

### [​](#12-10-governing-law) 12.10. Governing Law

Any Claims will be governed by and construed and enforced in accordance with the laws of the State of California, except to the extent preempted by U.S. Federal Law, without regard to conflict of law rules or principles (whether of the State of California or any other jurisdiction) that would cause the application of the laws of any other jurisdiction. If any Claim is not subject to arbitration pursuant to Section 10, then the state and federal courts located in the County of San Francisco, California, will have exclusive jurisdiction. You and World Labs waive any objection to venue in any such courts. If your local law requires that consumer contracts be interpreted subject to local law and enforced in the courts of that jurisdiction, this section may not apply to you only to the extent that local law conflicts with this section.

### [​](#12-11-export-control) 12.11. Export Control

Each Party shall comply with their respective obligations under applicable export laws and regulations of the United States, European Union, and other applicable jurisdictions when providing, accessing, and using the Services. You represent and warrant that: (a) you are not located in, a resident of, or a national of, any country subject to a U.S. government embargo or other restriction, or that has been designated by the U.S. government as a “terrorist supporting” country; and (b) you are not on any of the U.S. government lists of restricted end users. For API integrations, you agree to implement appropriate geographic and user access controls consistent with export control requirements.

### [​](#12-12-severability) 12.12. Severability

If any portion of this TOS other than Section 10 is found to be unenforceable or unlawful for any reason, including but not limited to because it is found to be unconscionable, (a) the unenforceable or unlawful provision will be severed from this TOS; (b) severance of the unenforceable or unlawful provision will have no impact whatsoever on the remainder of this TOS; and (c) the unenforceable or unlawful provision may be revised to the extent required to render this TOS enforceable or valid, and the rights and responsibilities of the Parties will be interpreted and enforced accordingly, so as to preserve this TOS and the intent of this TOS to the fullest possible extent.

### [​](#12-13-notices) 12.13. Notices

Except as otherwise set forth herein, all notices required or permitted hereunder will be in writing and deemed to have been duly given to the addresses given to World Labs at the address specified in Section 14, and to User at the email address or mailing address associated with User’s Account: (i) on the next day if delivered personally to such Party; (ii) on the next day after mailing if mailed by registered or certified mail; (iii) if sent by email from and to the addresses herein specified; or (iv) to such other address or email as either Party may notify the other through written notice.

### [​](#12-14-interpretation) 12.14. Interpretation

The Section or other provision titles in this TOS are for convenience of reference only and do not in any manner affect the construction or meaning of anything herein contained or govern the rights or liabilities of the Parties hereto. The words “include,” “includes,” and “including” shall be deemed to be followed by the words “without limitation”. The word “or” is not exclusive. The words “herein,” “hereof,” “hereto,” and “hereunder” refer to this TOS as a whole. References to defined terms in singular form include the plural and vice versa, unless otherwise specified.

### [​](#12-15-marketing-and-publicity) 12.15. Marketing and Publicity

You agree that during the term of this TOS, and consistently with any established branding guidelines, World Labs may reference your name and use of the Services, including in World Labs’ marketing materials, case studies, sales and other business presentations; for World Labs’ internal business purposes; and on the Site, unless you expressly and in writing prohibit such references by notifying World Labs at [legal@worldlabs.ai](mailto:legal@worldlabs.ai).

### [​](#12-16-force-majeure) 12.16. Force Majeure

World Labs will not be liable for any failure or delay in performing its obligations under this TOS where such failure or delay results from circumstances beyond the reasonable control of World Labs including acts of God, natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, pandemics, strikes, or failures of third-party telecommunications or power supply. World Labs shall, in the event of such circumstances, take prompt reasonable efforts to mitigate the circumstances and impacts thereof.

## [​](#13-definitions) 13. DEFINITIONS

**13.1. “Acceptable Use Policy” or “AUP”** means the policy covering permitted and prohibited uses of the Services, herein incorporated in its entirety, provided by World Labs and available at <https://www.worldlabs.ai/aup>.
**13.2. “Account”** means the user profile created with World Labs that enables access to and use of the Services, and accessible at <https://marble.worldlabs.ai/account>.
**13.3. “AI Models”** means World Labs’ proprietary artificial intelligence models designed for, among other functions, 3D world generation and spatial intelligence applications.
**13.4. “API Credentials”** means collectively authentication tokens, API keys, access credentials, or other security mechanisms provided by World Labs to enable authorized API access, including associated metadata, usage permissions, and security configurations. API Credentials are confidential and proprietary to World Labs and subject to the security requirements set forth in Section 2.10.
**13.5. “Applicable Law”** means all laws and regulations applicable to a Party’s use of the Services.
**13.6. “Authorized Users”** means users authorized by you to use the Services.
**13.7. “Business Associate Agreement” or “BAA”** means as defined under HIPAA.
**13.8. “Commercial Purpose”** means any use of the Output for business, commercial, or revenue-generating purposes, including:

* **Direct Commercial Use:** receiving compensation, payment, or commercial benefit directly from the use, sale, licensing, or distribution of the Output;
* **Integration:** integrating the Output into software platforms, applications, or developer tools (including through API integrations where the Output becomes a component of customer-facing applications) that are offered commercially, integrated into business operations, or used in commercial contexts;
* **Marketing and Promotional Use:** using the Output for marketing, advertising, promotional, or branding purposes for any commercial entity;
* **Authorized Reseller Activities:** selling, licensing, or distributing the Output through authorized reseller, partner, or white-label arrangements as specifically permitted in applicable Order Forms; and
* **Sublicensing and Downstream Rights:** granting sublicenses or downstream usage rights to third-parties for commercial purposes, subject to the limitations set forth in this TOS and applicable Order Forms.

Clarification: Commercial Purpose includes both direct monetization of Output and indirect commercial benefit derived from Output integration, regardless of whether the Output user directly charges end customers for access to the Output itself.
**13.9. “Concurrency Limits”** means the maximum number of simultaneous API requests or connections permitted for an Account.
**13.10. “Confidential Information”** means any information disclosed by a Discloser to a Recipient that is marked or otherwise designated as confidential or proprietary or that should otherwise be reasonably understood to be confidential in light of the nature of the information and the circumstances surrounding disclosure, including without limitation, the existence and terms of this TOS, information relating to employees of a Party, and any business, financial, technical, customer, or product plans, forecasts, strategies or other information not generally known to the public, whether or not stored in any medium. Confidential Information does not include Feedback, or information that (i) at the time of disclosure or thereafter becomes generally known to the public through no fault of the Recipient; (ii) was already independently known by the Recipient prior to disclosure by the Discloser, as shown by the Recipient’s written records; (iii) is at any time independently developed by the Recipient without reference to or possession of the Discloser’s Confidential Information, as shown by the Recipient’s written records; or (iv) is disclosed to the Recipient by a third-party which did not directly or indirectly obtain such information from the Discloser subject to any confidentiality obligation.
**13.11. “Discloser”** means a Party which discloses Confidential Information to a Recipient.
**13.12. “DMCA Policy”** means the policy covering compliance with the Digital Millennium Copyright Act, herein incorporated in its entirety, provided by World Labs and available at <https://www.worldlabs.ai/dmca>.
**13.13. “Documentation”** means the Services instructions, online help files, user manuals, API specifications, technical requirements, and other developer guidelines made available to Users by World Labs concerning the use of the Services, accessible at <https://docs.worldlabs.ai/>.
**13.14. “Excluded Claim”** means a claim against World Labs based in whole or significant part on (i) compliance with designs, guidelines, plans, or specifications provided by you; (ii) your use of the Services in a manner that does not comply with this TOS; (iii) modification of the Services by you or on your behalf; (iv) User Content; or (v) the combination, operation, or use of the Services with other products or services.
**13.15. “Feedback”** means any questions, comments, suggestions, ideas, original or creative materials, or other information about World Labs or our Services, which may be voluntarily or gratuitously provided to World Labs by you from time to time during the Term of this TOS.
**13.16. “Fee Schedule”** means the schedule for paid Services made available to customers by World Labs, and their requisite fees.
**13.17. “Free Account Users”** means a User that accesses and uses the Services without an active paid Subscription Service, purchased Service Credits, or purchased and unused Top-Up Credits, including Users accessing Services through free account tiers, trial periods, free promotional access, or other unpaid service arrangements provided by World Labs.
**13.18. “HIPAA”** means the Health Insurance Portability and Accountability Act of 1996 (as amended, the “HIPAA Act”), and the Privacy Standards and Security Standards and other rules and regulations promulgated thereunder, the Health Information Technology for Economic and Clinical Health Act (“HITECH Act”), and the rules and regulations promulgated thereunder (HIPAA Act, HITECH Act, the Privacy Standards, the Security Standards and such other rules and regulations, collectively, “HIPAA”).
**13.19. “Input”** means User-provided prompt, script, images, videos, information, or other materials that Users can input, post, store, and share through the Services.
**13.20. “Non-Commercial Use”** means all activities not covered as Commercial Purpose, including personal, educational, or non-profit purposes where you do not: (A) receive any form of compensation, payment, or commercial benefit; (B) use the Output in connection with any business, commercial enterprise, or revenue-generating activity; (C) sell, license, distribute, or otherwise commercially exploit the Output; (D) use the Output for marketing, advertising, or promotional purposes for any commercial entity; or (E) incorporate the Output into any product or service offered for sale or commercial distribution.
**13.21. “Order Form”** means an order entry, form, quote, or other similar ordering action or document that identifies key information, including the Services World Labs will provide to You, the pricing for the Services, and other order-specific terms. An Order Form must reference this TOS and be signed or otherwise duly executed by both Parties, which execution may occur by (i) physical or electronic signature, (ii) click-through acceptance, or (iii) incorporation by reference into this TOS through your acceptance hereof. Exhibit A Order Form is incorporated into this TOS, applying to default website accounts. Separate Order Forms may supersede Exhibit A unless otherwise agreed.
**13.22. “Output”** means images, videos, text, 3D worlds, and other materials, generated by the Services based on a User’s input. Output does not include Feedback, System Data, or World Labs’ Products, technology, proprietary or Confidential Information, and intellectual property.
**13.23. “Paid Account Users”** means a User Account with active paid services, including: (i) active Standard, Pro, or Max Subscription Service plans; (ii) purchased and unused Service Credits; (iii) purchased and unused Top-Up Credits; or (iv) API access arrangements with associated fees or usage commitments.
**13.24. “Pay-As-You-Go” or “PAYG”** means a billing model where Users pay for services, including purchase and use of Service Credits, based on usage-based consumption.
**13.25. “Pre-GA Product”** means a product, feature, service, or other content that World Labs makes available to you, but which is identified as an “Alpha” or “Beta” version, “Pre-GA”, “Pre-Release”, or another identifier that indicates that the item is not yet generally-available. World Labs may offer such Pre-GA Products to you on a voluntary use basis; such products are not suitable for production use and are provided “as-is” on a temporary basis.
**13.26. “Pricing Page”** means the current pricing, services, or other fee schedules covering the free and paid Subscription Services, Service Credits, and related products, features, and functions made available by World Labs to Users at <https://marble.worldlabs.ai/pricing>.
**13.27. “Privacy Policy”** means the policy describing World Labs’ practices concerning the processing of personal information, available at <https://www.worldlabs.ai/privacy-policy>.
**13.28. “Protected Health Information”** means as defined in 45 CFR § 160.103.
**13.29. “Rate Limiting”** means technical controls implemented by World Labs to restrict API access frequency, volume, or duration to ensure system performance, security, and fair usage across all customers.
**13.30. “Recipient”** means a Party which receives Confidential Information from a Discloser.
**13.31. “Security Measures”** means the administrative, technical, physical, and organizational safeguards implemented by World Labs to protect the Services and Systems in accordance with industry standards.
**13.32. “Sensitive Data”** means any information that is subject to heightened regulatory protection or poses elevated privacy and security risks, including Protected Health Information subject to HIPAA, educational records subject to FERPA, financial information regulated under applicable financial privacy laws, government identification numbers, special category personal data as defined under applicable Data Protection Laws, children’s information subject to COPPA or similar laws, biometric data used for identification purposes, and other information subject to sector-specific regulatory restrictions.
**13.33. “Service Credits”** means pre-paid credits for use with the Services, including credits allocated through Subscription Services, purchased as Top-Up Credits, or purchased independently for API access.
**13.34. “Services”** means collectively the Site as well as World Labs’ Products.
**13.35. “Subscription Services”** means Services offered on a subscription basis with recurring billing, separated into different subscription tiers.
**13.36. “System”** means any system, network, platform, database, computer, facility, application, software, hardware, interface, development or performance testing tool, telecommunications equipment, cabling, storage device, or other technology used in connection with the Services.
**13.37. “System Data”** means data collected, generated, or derived by World Labs concerning the performance, availability, usage, integrity, or security of the Services, including:

* **Service Operations Data:** logs, statistics, reports, and metrics concerning the performance, availability, uptime, integrity, security, and operational status of the Services and Systems;
* **Usage Data:** aggregated and anonymized data regarding user interactions, feature utilization, API call patterns, credit consumption, and service usage trends, excluding personally identifiable information; and anonymized and aggregated derivatives of Inputs and Outputs used for training, improving, or developing World Labs AI Models, and related technologies, subject to applicable opt-out rights;
* **API Technical Data:** authentication logs, rate limiting data, API endpoint usage statistics, integration performance metrics, and technical diagnostic information related to API access and functionality; and
* **System Enhancement Data:** technical improvements, optimizations, and derivatives developed by World Labs based on service provision, user interactions, and system performance analysis.

System Data excludes Inputs in its original form, and personally identifiable information (except as anonymized, aggregated, or otherwise herein provided).
**13.38. “Third-Party Content”** means information about or links to third-party products, services, activities, or events, or content and information made available by third-parties, on or through the Services.
**13.39. “Third-Party Materials”** means third-party products and services, including, without limitation, data storage services, communications technologies, IoT platforms, third-party app stores, and internet and mobile operators.
**13.40. “User”** means any individual or entity who accesses or uses the Services, including Authorized Users.
**13.41. “User Content”** means any Input and Output.
**13.42. “World Labs Products”** means World Labs’ products and services, including spatial intelligence AI products covering AI Models and associated software, APIs, interfaces, and cloud-based infrastructure.

## [​](#14-contact-us) 14. CONTACT US

If you have a question or complaint regarding the Services, please send an email to [support@worldlabs.ai](mailto:support@worldlabs.ai) or [legal@worldlabs.ai](mailto:legal@worldlabs.ai). You may also contact us by writing to 640 2nd Street, Floor #3, San Francisco, CA 94107. Please note that email communications will not necessarily be secure; accordingly, you should not include payment card information or other sensitive information in your email correspondence with us.
Further, under California Civil Code Section 1789.3, California consumers are entitled to the following specific consumer rights notice: The Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs may be contacted in writing at 1625 North Market Boulevard, Suite N-112, Sacramento, California 95834, or by telephone at 1 (800) 952-5210.


---

## [​](#exhibit-a-order-form) EXHIBIT A: ORDER FORM

| ORDER DETAILS | ENTRIES |
| --- | --- |
| **World Labs** | World Labs Technologies, Inc. 640 2nd Street, San Francisco, CA 94107 [legal@worldlabs.ai](mailto:legal@worldlabs.ai), [support@worldlabs.ai](mailto:support@worldlabs.ai) |
| **User** | User Name, Address, Email: As registered in User’s Account |
| **Service Details** | ”Order Start Date”: Account creation date ”Service Term”: Month-to-Month ”Commit”: N/A ”Renewal”: Automatic |
| **Invoicing Details** | ”Invoice Schedule”: Monthly ”Commit Schedule”: N/A ”Payment Method”: Payment method on file in your Account ”Payment Term”: Due upon receipt |

### [​](#1-order-summary) 1. ORDER SUMMARY

#### [​](#1-1-services) 1.1. Services

As of the Order Start Date, World Labs will provide access to the Services as selected by you, and reflected in your Account, throughout the Term; in exchange, you agree to pay World Labs as provided herein and noted in your Account.

#### [​](#1-2-invoice-and-payments) 1.2. Invoice and Payments

Invoices will be issued based on the Invoice Schedule specified in the Order Details above. World Labs will invoice you for such fees as per the Invoice Schedule and you shall pay said invoices per the Payment Term. Payment will be processed using the Payment Method specified in the Order Details above.

#### [​](#1-3-pricing) 1.3. Pricing

You will be provided with Service Credits or enrolled in subscription billing based on your Subscription Service or other elections in your Account. All Subscription Services and Service Credit pricing, features, and service specifications are subject to modification by World Labs in accordance with TOS Section 6.4(b). Services covered by this Order Form will be charged per the Fee Schedule in Appendix A.

#### [​](#1-4-commits) 1.4. Commits

If you have agreed to a non-zero Commit, this Section 1.4 applies. Your use of the Services will be debited first against your Commit Service Credit balance (“Commit Balance”). Your Commit obligation will be invoiced in roughly equal installments spanning the Commit Schedule period. If you deplete the Commit Balance before your Commit is fully paid, the remaining amount will be accelerated, invoiced to you per the Invoice Schedule, with payment due per the Payment Term.

### [​](#2-order-term) 2. ORDER TERM

#### [​](#2-1-term) 2.1. Term

This Order Form commences on the Order Start Date and continues for the Service Term, unless terminated earlier (“Initial Term”). Notwithstanding the foregoing, if the Service Term is designated “Unfixed”, and there is a non-zero Commit, the Initial Term expires when the Commit Balance is depleted.

#### [​](#2-2-non-renewal) 2.2. Non-Renewal

If Renewal is not designated “Automatic”, this Order Form terminates at the end of the Service Term.

#### [​](#2-3-automatic-renewals) 2.3. Automatic Renewals

If Renewal is designated “Automatic”, each Party may opt out of renewals by providing written notice to the other Party, pursuant to the TOS Sections 6.4 and 11 cancellation provisions, and the following applies:

##### a. Fixed Service Term

If the Service Term is not designated “Unfixed”, this Order Form automatically renews for successive Service Terms (each a “Renewal Term”), subject to the terms and pricing in effect at the time of renewal, unless terminated or cancelled before the renewal; and, upon depletion of the Commit Balance before the expiration of the Service Term, your further use of the Services for the duration of the Service Term will be invoiced on a PAYG basis, charged at the Fee Schedule rates at time of utilization.

##### b. Unfixed Service Term

If the Service Term is designated “Unfixed”, and there is a non-zero Commit, upon depleting the Commit Balance, the Order Form will renew for subsequent refreshed Commits matching the Initial Term (each a “Renewal Term”).

### [​](#3-services) 3. SERVICES

#### [​](#3-1-subscriptions) 3.1. Subscriptions

Upon enrollment in any Subscription Services, you will receive the commensurate Service Credits, usage rates, feature access, and service capabilities associated with your elected Subscription Service. Your specific entitlements, including Service Credit allocations and feature availability, are determined by your active Subscription Service tier, and are subject to the Appendix A fee schedules and related terms.

#### [​](#3-2-credit-allocation-and-expiration) 3.2. Credit Allocation and Expiration

##### a. Monthly Allocation

Service Credits are allocated to your Account in accordance with your Service Term and active Subscription Service plan. Unused Service Credits expire on the last day of each monthly billing period and do not carry forward to subsequent billing periods.

##### b. Overages

If your Service Credit usage in any billing period exceeds your subscription plan’s monthly allocation (“Overage Usage”), you will be charged for such Overage Usage at your next billing cycle. Overage charges will be calculated as: (number of excess credits used) × (per-credit rate for your subscription tier as specified on Appendix A) and will be added to your next subscription payment. You authorize World Labs to charge your designated payment method for the combined amount of your regular subscription fee plus any Overage charges. You must pay any outstanding overage balance in full before being eligible to purchase Top-Up Credits. If you purchase Top-Up Credits when your Account reflects an unpaid Overage Usage, any payment for Top-Up Credits would go first to pay off the Overage Usage balance.

##### c. Credit Consumption and Pricing

Service Credits are consumed based on your use of the Services, with each service action having an associated credit cost as specified on Appendix A. Credit consumption occurs in real-time upon completion of each service action. You are responsible for monitoring your credit balance and usage.

#### [​](#3-3-api-access-and-use) 3.3. API Access and Use

For Users accessing Services via APIs, API use, access, restrictions, and requirements as provided in the TOS apply. API usage is billed through Service Credits as specified in TOS Section 6, with consumption rates as well as associated other Rate Limiting, Concurrency Limits, Usage restrictions, and associated fees and limitations specified on Appendix A.

#### [​](#3-4-plan-modifications) 3.4. Plan Modifications

You may modify your Subscription Service plan at any time, subject to the terms and pricing in effect at the time of modification. Plan downgrades take effect at the beginning of your next billing period unless otherwise specified. Downgrades may result in loss of access to certain features or reduced credit allocations. Plan upgrades take effect immediately, and if a User upgrades from the Standard plan to the Pro or Max plans, unused Standard plan Service Credits are applied as discounts for the first month of the upgraded Pro or Max plans.

### [​](#4-custom-terms) 4. CUSTOM TERMS

#### [​](#4-1-supplemental-terms) 4.1. Supplemental Terms

The custom or Supplemental Terms in Appendix B are hereby incorporated into this Order Form. Appendix B will prevail in case of conflict with other provisions of this Order Form or the TOS.

### [​](#5-additional-terms) 5. ADDITIONAL TERMS

#### [​](#5-1-governing-terms) 5.1. Governing Terms

Unless otherwise herein provided, any terms not specified in this Order Form shall be governed by and subject to the applicable provisions of the TOS.

#### [​](#5-2-contact-information) 5.2. Contact Information

For questions regarding this Order Form or billing matters, see the Contact Us section in the TOS.


---

## [​](#exhibit-a-appendix-a-fee-schedule) EXHIBIT A, APPENDIX A: FEE SCHEDULE

Fee Schedule applicable for this Order Form is the public Pricing Page. Users should refer to the Pricing Page for the most up-to-date terms and pricing information.


---

## [​](#exhibit-a-appendix-b-custom-terms) EXHIBIT A, APPENDIX B: CUSTOM TERMS

N/A

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create

Pick the best way to begin imagining your world:
[## Prompt guides

Learn how to create your first world by prompting Marble with text, images, or video.](/marble/create/prompt-guides)
[## Chisel tools

Use Marble’s built-in 3D modeling tools to block out geometric layouts and architectural structures as the foundation for detailed world generation.](/marble/create/chisel-tools)
[## Studio tools

Take your world creation to the next level with advanced studio capabilities: compose and arrange multiple existing worlds into larger, seamless environments, or create cinematic camera animations and record smooth flythrough videos of your worlds.](/marble/create/studio-tools)

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/support/faq

### [​](#how-can-i-insert-characters) How can I insert characters?

Currently, this can be done by exporting to Spark or other software. Learn more here: <https://t.co/r4Dia8P7c8>

### [​](#is-there-an-api-available) Is there an API available?

Yes! See <platform.worldlabs.ai> for more information.

### [​](#how-do-i-share-my-world-with-others) How do I share my world with others?

Click on your world card to open the preview, then use the “Copy link” button to share a web link that others can view in their browser.

### [​](#how-do-i-experience-the-world-in-vr) How do I experience the world in VR?

Open your world card and use the “Copy VR link” button to get a VR-compatible link, or click the VR icon to open the world directly in your VR headset.

### [​](#where-can-i-read-more-about-world-labs-policies) Where can I read more about World Labs policies?

Please view our [Terms of Service](/terms-of-service) and [Privacy Policy](/privacy-policy) for details.

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/reference/media-assets/prepare-upload

[Skip to main content](#content-area)

[World Labs home page![light logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/light.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=e8a47e11f09a015f4e2461d9c026f36d)![dark logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/dark.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=83022c4e82ec8ac3d43c355bfaf2a06f)](/)

##### Get started

* [Quickstart](/api)
* [Tools & examples](/api/examples)

##### Reference

* + [POST

    Prepare media asset upload](/api/reference/media-assets/prepare-upload)
  + [GET

    Get media asset](/api/reference/media-assets/get)
* + [POST

    Generate a World](/api/reference/worlds/generate)
  + [GET

    Get a World](/api/reference/worlds/get)
  + [POST

    List Worlds](/api/reference/worlds/list)
* + [GET

    Get an Operation](/api/reference/operations/get)
* [OpenAPI spec](/api/reference/openapi)

##### Support & billing

* [Pricing](/api/pricing)
* [Rate limits](/api/rate-limits)
* [Frequently asked questions](/api/faq)

* [Discord](https://discord.gg/jSSSgXWT3v)
* [Company](https://worldlabs.ai)
* [Go to Marble](https://marble.worldlabs.ai)

[World Labs home page![light logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/light.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=e8a47e11f09a015f4e2461d9c026f36d)![dark logo](https://mintcdn.com/worldlabs/KSa1xA3OEMbBV4rE/logo/dark.svg?fit=max&auto=format&n=KSa1xA3OEMbBV4rE&q=85&s=83022c4e82ec8ac3d43c355bfaf2a06f)](/)

[Marble](/)[API](/api)

[Marble](/)[API](/api)

POST

/

marble

/

v1

/

media-assets:prepare\_upload

Prepare a media asset upload

Copy

```python
curl --request POST \
  --url https://api.worldlabs.ai/marble/v1/media-assets:prepare_upload \
  --header 'Content-Type: application/json' \
  --header 'WLT-Api-Key: <api-key>' \
  --data '
{
  "file_name": "<string>",
  "kind": "image",
  "extension": "mp4",
  "metadata": {}
}
'
```

Copy

```python
{
  "media_asset": {
    "created_at": "2023-11-07T05:31:56Z",
    "file_name": "<string>",
    "kind": "image",
    "media_asset_id": "<string>",
    "extension": "mp4",
    "metadata": {},
    "updated_at": "2023-11-07T05:31:56Z"
  },
  "upload_info": {
    "upload_method": "<string>",
    "upload_url": "<string>",
    "curl_example": "<string>",
    "required_headers": {}
  }
}
```

#### Authorizations

[​](#authorization-wlt-api-key)

WLT-Api-Key

string

header

required

API key for authentication. Get your key from the developer portal.

#### Body

application/json

Request to prepare a media asset upload.

[​](#body-file-name)

file\_name

string

required

File name

[​](#body-kind)

kind

enum<string>

required

High-level media type

Available options:

`image`,

`video`

Examples:

`"image"`

`"video"`

[​](#body-extension-one-of-0)

extension

string | null

File extension without dot

Example:

`"mp4"`

[​](#body-metadata-one-of-0)

metadata

Metadata · object

Optional application-specific metadata

#### Response

Successful Response

Response from preparing a media asset upload.

[​](#response-media-asset)

media\_asset

MediaAsset · object

required

The created media asset

Show child attributes

[​](#response-upload-info)

upload\_info

UploadUrlInfo · object

required

Upload URL information

Show child attributes

Was this page helpful?

[Previous](/api/examples)[Get media assetGet a media asset by ID.
Retrieves metadata for a previously created media asset.
Args:
media\_asset\_id: The media asset identifier.
Returns:
MediaAsset object with media\_asset\_id, file\_name, extension, kind,
metadata, created\_at, and updated\_at.
Raises:
HTTPException: 404 if not found

Next](/api/reference/media-assets/get)

⌘I

Prepare a media asset upload

Copy

```python
curl --request POST \
  --url https://api.worldlabs.ai/marble/v1/media-assets:prepare_upload \
  --header 'Content-Type: application/json' \
  --header 'WLT-Api-Key: <api-key>' \
  --data '
{
  "file_name": "<string>",
  "kind": "image",
  "extension": "mp4",
  "metadata": {}
}
'
```

Copy

```python
{
  "media_asset": {
    "created_at": "2023-11-07T05:31:56Z",
    "file_name": "<string>",
    "kind": "image",
    "media_asset_id": "<string>",
    "extension": "mp4",
    "metadata": {},
    "updated_at": "2023-11-07T05:31:56Z"
  },
  "upload_info": {
    "upload_method": "<string>",
    "upload_url": "<string>",
    "curl_example": "<string>",
    "required_headers": {}
  }
}
```

Assistant

Responses are generated using AI and may contain mistakes.

[Contact support](mailto:support@worldlabs.ai)

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/release-notes

## [​](#january-29-2026) January 29, 2026

### [​](#features-and-improvements) Features and Improvements

* Meshes can now be imported into Composer
* **Cancel Subscription** button is easier to find
* Video prompt file **size** limit for the API **increased** to 100MB

## [​](#january-1-2026) January 1, 2026

### [​](#features-and-improvements-2) Features and Improvements

* Improved export options
* Assets are now roughly scaled and grounded to better match real-world units
* Option to choose between \*\*OpenGL \*\*and **OpenCV** coordinate systems
* Customize export preferences for **high-quality meshes** (vertex-colored vs textured)

## [​](#december-18-2025) December 18, 2025

### [​](#features-and-improvements-3) Features and Improvements

* You can now copy & paste in Chisel using Ctrl+C / Ctrl+V
* Expand mode now provides clearer guidance on valid expansion regions, including more **explicit feedback** when the target position is too high or too low in the scene

## [​](#december-11-2025) December 11, 2025

### [​](#features-and-improvements-4) Features and Improvements

* Record mode in Studio now gives you more creative control: You can now freely move the floating preview window as you plan your flythrough, and you now have **expanded video export settings for quality**, resolution, aspect ratio, frame rate and codec (compression format) to tailor your final video.
* Improved export compatibility with external tools: World generations now export in the OpenGL coordinate system (previously OpenCV) for both splats and meshes. SPZ splats in Studio now export by default in SPZ v2 format (v3 still available as opt-in).

### [​](#bug-fixes) Bug Fixes

* Fixed bugs around world generation status and added better error messaging for failed generations.
* Fixed bug around display of thumbnails for in-progress world generations.
* Fixed a bug in Compose mode within Studio where importing the same world twice caused edits to be shared across both imported worlds.
* Fixed bugs around payment downgrade/cancellation processing.

## [​](#december-5-2025) December 5, 2025

### [​](#features-and-improvements-5) Features and Improvements

* Added ability to take screenshots of 360° panoramas.
* Added option to remove previously linked payment methods from your account.
* Upgraded pano editing to the latest high-quality model version. As part of this update, the credit cost per pano edit has been adjusted from **50 to 150 credits**.

### [​](#bug-fixes-2) Bug Fixes

* Fixed issue that prevented some projects from loading in Marble Studio.
* Fixed transform handles not being clickable in **Compose** mode.
* Fixed bug causing **video export in Animate** mode to fail on certain devices.
* Fixed issue where **Chisel panorama view** restricted camera controls after returning to the page.
* Fixed several bugs around **payment success**, **downgrades**, and **cancellation** flows.

## [​](#november-20-2025) November 20, 2025

### [​](#features-and-improvements-6) Features and Improvements

* Marble Studio now supports editing and composing significantly larger worlds using a new **Level-of-Detail splat-rendering backend**. Performance should remain stable as you scale up to more worlds and higher splat counts.
* **World IDs** are now displayed in the Worlds section, making it easier to share them with support for debugging.

### [​](#bug-fixes-3) Bug Fixes

* Fixed bug where some world generations appeared to be ongoing/spinning for long durations of time without finishing.
* Fixed bug where users could exceed their available credit balances and were subsequently charged for the overage amount when upgrading their subscription plans. Also corrected a credit-to-dollar conversion issue that could overstate the overage amount. Refunds have been issued and all balances were restored to their original subscription credit amounts.
* Fixed bug that caused some users to be unable to upgrade their subscriptions.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/export/mesh

# [​](#mesh-export-downloading-3d-assets) Mesh Export: Downloading 3D Assets

Export your Marble worlds as 3D meshes for use in game engines, 3D software, and other
applications. Choose from multiple mesh formats and quality levels to suit your specific
needs, from quick prototyping to high-quality production assets.

## [​](#getting-started-with-collider-mesh-export) Getting Started with Collider Mesh Export

You can export collider mesh along with a splat to provide simple physics for games.
For example, see [**first person shooting game**](https://github.com/bmild/spark-physics).
To download collider mesh, navigate to the  download menu from
world viewer, or world in  Worlds, and download from the
 Collider Mesh (GLB) link.

## [​](#getting-started-with-high-quality-mesh-export) Getting Started with High Quality Mesh Export

1. **Trigger Offline Generation**: Select
    **High-quality mesh (GLB)** from your world’s
   export options
2. **Wait for Processing**:  High-quality mesh generation takes up to an hour to complete
3. **Continue Working**: You can close tabs and browser windows - the process continues in the background
4. **Download When Ready**: Return later to find a
    **High-quality mesh (GLB)** button replacing the generate option
5. **Access Premium Quality**: Download detailed meshes, one around 600k triangles and
   texture maps, another around 1M triangles with vertex colors.

## [​](#faq) FAQ

### [​](#how-long-does-offline-mesh-generation-take) How long does offline mesh generation take?

High-quality mesh generation could take up to 1 hour, depending on world complexity and
system load. You can close your browser and the process will continue in the background.

### [​](#can-i-use-collider-meshes-for-visual-rendering) Can I use collider meshes for visual rendering?

No. **Collider meshes** are optimized for physics interactions and have simplified geometry.
For visual rendering, use splats or the high-quality offline-generated meshes instead.

### [​](#how-do-i-know-when-my-offline-mesh-is-ready) How do I know when my offline mesh is ready?

Return to your world’s  download menu after several hours.
The  **High-quality mesh (GLB)** or option will be
replaced with a  **High-quality mesh (GLB)** button when processing
is complete.

### [​](#what’s-included-with-high-quality-meshes) What’s included with high-quality meshes?

High-quality meshes include detailed geometry (around 600k triangles), and texture maps
. Some versions also include vertex color data for additional
material flexibility. See examples on [Export File Specs →](/marble/export/specs).

### [​](#can-i-cancel-offline-mesh-generation) Can I cancel offline mesh generation?

Currently, once started, offline mesh generation runs to completion in the background.

### [​](#what’s-the-file-size-of-exported-meshes) What’s the file size of exported meshes?

File sizes vary by complexity and format. Collider mesh are typically 3-4 MB,
while high-quality meshes with textures are typical around 100 - 200 MB depending on
world details. See examples on [Export File Specs →](/marble/export/specs).

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/studio-tools

# [​](#studio-compose-building-connected-worlds) Studio Compose: Building Connected Worlds

Use Studio Compose to connect multiple existing worlds into larger, seamless environments. Perfect for creating game maps, architectural complexes, or any scenario where you need to join separate scenes into one cohesive experience.

## [​](#getting-started-with-compose) Getting Started with Compose

The Studio Compose interface provides powerful tools for world arrangement:

* **3D Viewport**: The main canvas showing your connected worlds
* **Scene Panel**: Manage and add worlds to your composition
* **Controls Panel**: Fine-tune positioning, rotation, and scaling
* **Project Tools**: Save, share, and export your composed world

## [​](#how-to-add-worlds-to-your-composition) How to Add Worlds to Your Composition

Build your composition by importing existing worlds:

1. **Click Add Scene**: In the Scene panel, select **Add** to browse your worlds
2. **Choose Your World**: Select from your saved worlds or community creations
3. **Position the World**: The world appears in the viewport with positioning handles
4. **Repeat as Needed**: Add multiple worlds to build your larger environment

## [​](#splat-removal) Splat Removal

2. **Brush:** Use circle or square brushes to delete splats.
3. **Brush Size:** Adjust the brush size for more precise control.

## [​](#how-to-position-and-align-worlds) How to Position and Align Worlds

Precisely control world placement:

1. **Select a World**: Click on any world in the viewport or Scene panel
2. **Use Position Controls**: In the Controls panel, adjust X, Y, Z coordinates
3. **Set Rotation**: Modify rotation values to orient worlds correctly
4. **Adjust Scale**: Change the scale value to resize worlds proportionally
5. **Visual Alignment**: Use the grid and bounding corners for visual reference

## [​](#how-to-navigate-your-composition) How to Navigate Your Composition

Move around your large-scale environment:

1. **Adjust Move Speed**: Set movement speed (default: 3) for comfortable navigation
2. **Enable Natural Mouse**: Toggle natural mouse controls for intuitive camera movement
3. **Set Field of View (FOV)**: Adjust to 92 or your preferred viewing angle
4. **Use Grid Reference**: Toggle grid visibility to help with alignment
5. **Show Bounding Corners**: Enable to see world boundaries clearly

## [​](#how-to-fine-tune-world-connections) How to Fine-Tune World Connections

Create seamless transitions between worlds:

1. **Check Overlapping Areas**: Look for where worlds meet or overlap
2. **Align Ground Levels**: Ensure floor heights match between connected worlds
3. **Match Lighting**: Adjust worlds so lighting conditions blend naturally
4. **Test Transitions**: Navigate between worlds to check for smooth movement
5. **Adjust Background Color**: Set consistent background (BG Color: #3f3f3f) across scenes

## [​](#how-to-save-and-export-your-composition) How to Save and Export Your Composition

Preserve and share your connected world:

1. **Save Your Project**: Use the save controls to preserve your composition
2. **Share Settings**: Enable sharing if you want others to view your creation
3. **Export Options**: Use the Export button to generate files for external use
4. **Monitor Splats**: Keep track of your splat usage (500,000 / 2,000,000 limit shown)

## [​](#faq) FAQ

### [​](#what-does-the-splat-count-represent) What does the splat count represent?

Splats represent the 3D Gaussian Splat data that makes up your worlds. The counter shows your current usage against your account limit. Larger, more detailed worlds use more splats.

### [​](#what-is-the-layer-panel-for) What is the Layer panel for?

The Layer panel lets you organize and manage the visibility of different worlds in your composition. You can hide or show specific worlds while working.

### [​](#how-do-i-delete-a-world-from-my-composition) How do I delete a world from my composition?

Select the world you want to remove and press delete key. The world will be removed from the composition but remains in your library.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/studio-tools/compose

# [​](#studio-compose-building-connected-worlds) Studio Compose: Building Connected Worlds

Use Studio Compose to connect multiple existing worlds into larger, seamless environments. Perfect for creating game maps, architectural complexes, or any scenario where you need to join separate scenes into one cohesive experience.

## [​](#getting-started-with-compose) Getting Started with Compose

The Studio Compose interface provides powerful tools for world arrangement:

* **3D Viewport**: The main canvas showing your connected worlds
* **Scene Panel**: Manage and add worlds to your composition
* **Controls Panel**: Fine-tune positioning, rotation, and scaling
* **Project Tools**: Save, share, and export your composed world

## [​](#how-to-add-worlds-to-your-composition) How to Add Worlds to Your Composition

Build your composition by importing existing worlds:

1. **Click Add Scene**: In the Scene panel, select **Add** to browse your worlds
2. **Choose Your World**: Select from your saved worlds or community creations
3. **Position the World**: The world appears in the viewport with positioning handles
4. **Repeat as Needed**: Add multiple worlds to build your larger environment

## [​](#splat-removal) Splat Removal

2. **Brush:** Use circle or square brushes to delete splats.
3. **Brush Size:** Adjust the brush size for more precise control.

## [​](#how-to-position-and-align-worlds) How to Position and Align Worlds

Precisely control world placement:

1. **Select a World**: Click on any world in the viewport or Scene panel
2. **Use Position Controls**: In the Controls panel, adjust X, Y, Z coordinates
3. **Set Rotation**: Modify rotation values to orient worlds correctly
4. **Adjust Scale**: Change the scale value to resize worlds proportionally
5. **Visual Alignment**: Use the grid and bounding corners for visual reference

## [​](#how-to-navigate-your-composition) How to Navigate Your Composition

Move around your large-scale environment:

1. **Adjust Move Speed**: Set movement speed (default: 3) for comfortable navigation
2. **Enable Natural Mouse**: Toggle natural mouse controls for intuitive camera movement
3. **Set Field of View (FOV)**: Adjust to 92 or your preferred viewing angle
4. **Use Grid Reference**: Toggle grid visibility to help with alignment
5. **Show Bounding Corners**: Enable to see world boundaries clearly

## [​](#how-to-fine-tune-world-connections) How to Fine-Tune World Connections

Create seamless transitions between worlds:

1. **Check Overlapping Areas**: Look for where worlds meet or overlap
2. **Align Ground Levels**: Ensure floor heights match between connected worlds
3. **Match Lighting**: Adjust worlds so lighting conditions blend naturally
4. **Test Transitions**: Navigate between worlds to check for smooth movement
5. **Adjust Background Color**: Set consistent background (BG Color: #3f3f3f) across scenes

## [​](#how-to-save-and-export-your-composition) How to Save and Export Your Composition

Preserve and share your connected world:

1. **Save Your Project**: Use the save controls to preserve your composition
2. **Share Settings**: Enable sharing if you want others to view your creation
3. **Export Options**: Use the Export button to generate files for external use
4. **Monitor Splats**: Keep track of your splat usage (500,000 / 2,000,000 limit shown)

## [​](#faq) FAQ

### [​](#what-does-the-splat-count-represent) What does the splat count represent?

Splats represent the 3D Gaussian Splat data that makes up your worlds. The counter shows your current usage against your account limit. Larger, more detailed worlds use more splats.

### [​](#what-is-the-layer-panel-for) What is the Layer panel for?

The Layer panel lets you organize and manage the visibility of different worlds in your composition. You can hide or show specific worlds while working.

### [​](#how-do-i-delete-a-world-from-my-composition) How do I delete a world from my composition?

Select the world you want to remove and press delete key. The world will be removed from the composition but remains in your library.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/support/support-feedback

## [​](#join-our-community) Join our community

In addition to the learning resources found here, you can also join the World Labs
[Discord](https://discord.gg/jSSSgXWT3v) server to connect with other creators and get
more information. We announce product updates, listen to your feature requests, and
even host live events. It’s where our creators from around the world come together to
brainstorm ideas and showcase the latest projects they’re working on in Marble.
Want more? Check out our [YouTube](https://www.youtube.com/@WorldLabsAI) channel and
follow us on [X](https://x.com/theworldlabs) and
[Instagram](https://www.instagram.com/theworldlabs/?igsh=NTc4MTIwNjQ2YQ%3D%3D#) to stay
up to date.

## [​](#get-support-&-share-feedback) Get support & share feedback

Have questions or feedback? Head over to the 🤝│ help channel in
[Discord](https://discord.gg/jSSSgXWT3v) to get support and the 💡 | ideas-and-features
channel to report a bug or share your feature ideas. We welcome all feedback to help us
shape the future of Marble!
We look forward to seeing the worlds you create!

## [​](#review-world-labs-policies) Review World Labs policies

Looking for more details? View our [Terms of Service](/terms-of-service) and [Privacy Policy](/privacy-policy).

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/support/platform.worldlabs.ai

404

# Page Not Found

We couldn't find the page.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/prompt-guides

## [​](#text-prompts) Text prompts

* Up to 2,000 characters
* Describe a location, such as “A warm, rustic cabin living room with a glowing stone fireplace, cozy leather sofa, wooden beams, and large windows overlooking a snowy forest.”

## [​](#images) Images

* Recommended resolution: 1024 on the long side
* Recommended aspect ratio: 16:9, 9:16, or anything in between
* Max file size: 20 MB
* Supported formats: png (recommended), jpg, webp
* See [Image Prompt Guide](./image-prompt) and [Multi-image Prompt Guide](./multi-image-prompt).

## [​](#panoramas) Panoramas

* full 360 degree equirectangular projection, in 2:1 aspect ratio.
* Recommended resolution: 2560 pixels wide
* See [Panorama Prompt Guide](./pano-prompt).

## [​](#video) Video

* Max file size: 100 MB
* Max duration: 30 seconds
* Supported formats: mp4, mov, webm
* See [Video Prompt Guide](./video-prompt).

## [​](#3d-structure-uploads-“chisel”-import) 3D structure uploads (“Chisel” Import)

* Max file size: 100 MB
* Supported formats: glb, fbx

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/multi-image-prompt

404

# Page Not Found

We couldn't find the page. Maybe you were looking for one of these pages below?

[Multi-image prompt tips](/marble/create/prompt-guides/multi-image-prompt#)[Quickstart](/api/index#multi-image-input)[Image prompt tips](/marble/create/prompt-guides/image-prompt#getting-started-with-image-prompts)

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/prompt-guides/advanced-create

The Advanced Create workflow in Marble gives you precise control over your world generation through a multi-stage process. Instead of jumping directly to a final world, you can refine and edit at each stage to ensure the perfect result.

## [​](#multi-stage-creation-process) Multi-Stage Creation Process

Start by dragging in your prompt into the omnibox under the  2D input mode. Check the “use advanced editing” box, and click on  Create to jump into the advanced workflow.
The advanced workflow breaks world creation into distinct stages, each offering opportunities for refinement:

### [​](#stage-1-pano) Stage 1: Pano

* **Purpose**: Establish the initial panoramic representation of your world
* **Input**: Your original prompt (text, image, video, etc.)
* **Output**: A 360° panoramic view that captures the spatial layout and visual elements

### [​](#stage-2-panorama-edit-optional) Stage 2: Panorama Edit (Optional)

* **Purpose**: Refine specific areas of the panorama before world generation
* **Process**:
  + Directly describe changes in the prompt box, and  Apply edit for global changes, or
  + Select edit area in the panoramic view and describe desired changes in the prompt box and  Apply edit for targeted local changes, or
  + Add images to add image references for the edit, and describe desired changes in the prompt box and  Apply edit for adding ingredients into the panorama.
* **Use Cases**:
  + Adjust lighting or colors
  + Modify objects
  + Add or remove details
  + Fix any issues with the initial panoramic generation
* **Tips**:
  + You can  Queue Draft creation in the background by clicking on each panorama thumbnail. You will get a notification when it finishes, and you can find the results in your “Worlds” tab from the side-nav.

### [​](#stage-3-draft) Stage 3: Draft

* **Purpose**: Generate a quick 3D preview to evaluate spatial structure
* **Output**: A lightweight 3D world for rapid assessment
* **Benefits**: Preview the 3D structure and identify any needed changes before full processing. If any details stand out, you can further edit the panorama to change it.

### [​](#stage-4-world-generation) Stage 4: World Generation

* **Purpose**: Create the final high-quality 3D world
* **Process**: Full processing of the panorama into a complete 3D environment
* **Output**: Complete navigable 3D world ready for exploration and export
* **Tips**:
  + Toggle “Public mode” to change if generated world will be visible from public gallery.

## [​](#additional-tips) Additional Tips

* Jump back into the advanced editing flow with  Continue creating.

## [​](#when-to-use-advanced-create) When to Use Advanced Create

The Advanced Create workflow is ideal when you need:

* **Precision Control**: Fine-tune specific elements before committing to full world generation
* **Professional Projects**: Commercial work requiring precise results and iterative feedback
* **Learning and Experimentation**: Understanding how changes at different stages affect the final output

The Advanced Create workflow transforms world generation from a single-step process into a refined, iterative experience that puts creative control in your hands.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/prompt-guides/expand

Use Expand to extend your existing worlds beyond their current boundaries.
This tool lets you seamlessly grow your environments by clicking on unexplored areas and
generating new content that naturally connects to your existing world.

## [​](#how-to-access-expand) How to Access Expand

For any generated world, hit the  **Continue Creating** paintbrush icon within the viewer or within your worlds tab to access the Expand tool.

## [​](#getting-started-with-expand) Getting Started with Expand

1. **Navigate Your World**: Move around using standard controls to explore your current boundaries
2. **Look for Edges**: Find areas where your world meets unexplored space
3. **Check for Warnings**: The system shows “Not within recommended area” when you’re near expansion zones
4. **Position Yourself**: Move to a good viewpoint of the area you want to expand
5. **Click Expand**: Press the **Expand** button in the bottom panel

## [​](#how-to-plan-strategic-expansions) How to Plan Strategic Expansions

## [​](#advanced-expansion-techniques) Advanced Expansion Techniques

### [​](#strategic-positioning) Strategic Positioning

* **Doorway Extensions**: Expand beyond doorways to create connected rooms
* **Corner Expansions**: Expand from corners to see large new areas
* **Landscape Extensions**: Extend outdoor areas to create larger environments

## [​](#common-expansion-scenarios) Common Expansion Scenarios

### [​](#indoor-extensions) Indoor Extensions

* Expand bedrooms into en-suite bathrooms
* Extend kitchens into dining areas or pantries
* Add hallways connecting separate rooms
* Create balconies or terraces from indoor spaces

### [​](#outdoor-growth) Outdoor Growth

* Expand gardens into larger landscaped areas
* Extend courtyards into street views or neighboring buildings
* Add pathways leading to new outdoor zones
* Create transitions from indoor to outdoor spaces

### [​](#architectural-additions) Architectural Additions

* Add wings to buildings or structures
* Extend rooflines or architectural features
* Create connecting bridges or walkways
* Add levels or floors to existing structures

## [​](#faq) FAQ

### [​](#what-does-“not-within-recommended-area”-mean) What does “Not within recommended area” mean?

This warning appears when you’re either too close to existing content or beyond the limits for expansion. It helps you identify where new content can be generated.

### [​](#how-do-i-know-where-i-can-expand) How do I know where I can expand?

Look for areas where your world meets unexplored or blurry spaces. These boundary zones are where expansion is possible.

### [​](#will-new-areas-match-my-existing-world’s-style) Will new areas match my existing world’s style?

Yes, the expansion system analyzes your existing world’s visual style, architecture,
and aesthetic to generate new areas that naturally fit and connect with your current environment.

### [​](#can-i-expand-in-multiple-directions) Can I expand in multiple directions?

Currently, you can perform one expansion of your world in different directions. You can
export the results to studio for stitching.

### [​](#what-happens-if-i-don’t-like-an-expansion) What happens if I don’t like an expansion?

Each expansion creates a new version while preserving previous states. You can return
to earlier versions or try expanding in different directions from your original world.

### [​](#how-do-expansions-connect-to-existing-areas) How do expansions connect to existing areas?

The system automatically creates seamless transitions between your existing world and
new areas, ensuring proper lighting, scale, and architectural continuity at the
connection points.

### [​](#can-i-expand-upwards-or-downwards) Can I expand upwards or downwards?

Not at the moment.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/export/gaussian-splat/houdini

[](https://mintcdn.com/worldlabs/MLFIZQFuNhLp0_rH/media/marble-export-houdini.mp4?fit=max&auto=format&n=MLFIZQFuNhLp0_rH&q=85&s=9aaf185168fedd4d4ae6c306a260925b)
The  [**GSOPs plugin**](https://github.com/cgnomads/GSOPs/tree/develop) is actively maintained and has a lot of great additional splat-related features around splat animation and splat conversions to vdb/mesh. We’ve verified it works on Houdini 20.5.
If you have had positive or negative experiences with this plugin, we appreciate your feedback and will be updating this page as we go.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/prompt-guides/image-prompt

# [​](#creating-worlds-from-images) Creating Worlds from Images

Transform your photos and images into immersive 3D worlds with Marble’s image-to-world generation. Learn how to select the best images and optimize your prompts for stunning results.

## [​](#getting-started-with-image-prompts) Getting Started with Image Prompts

Image prompting in Marble works by analyzing your uploaded image and generating a 3D environment based on its content, style, and composition. The AI understands spatial relationships, lighting, and architectural elements to create explorable worlds. You can do so dragging in images to the omnibox; it will expand with  2D input mode, which allows you to start a generation by clicking on  Create. For image file specifications, see [Prompt Guidelines →](/guides/prompt_guidelines)

## [​](#choosing-the-right-images) Choosing the Right Images

### [​](#image-quality-guidelines) Image Quality Guidelines

**Resolution and Clarity**

* Use high-resolution images (minimum 1024x1024 pixels)
* Ensure good lighting and clear details
* Avoid heavily compressed or pixelated images
* Sharp focus is preferred over blurry images

  Images need to be under 20Mb

**Composition Tips**

* Images with clear depth and perspective work best
* Multiple spatial elements create richer worlds
* Good balance between foreground, midground, and background
* Avoid flat or purely decorative images

## [​](#optimizing-your-image-selection) Optimizing Your Image Selection

### [​](#what-works-well) What Works Well

* **Clear Spatial Definition**: Images where you can see floors, walls, ceilings, or ground planes
* **Multiple Elements**: Scenes with furniture, objects, or architectural details
* **Good Lighting**: Natural or artificial lighting that defines the space

### [​](#what-to-avoid) What to Avoid

* **Close-up Shots**: Extreme close-ups of objects without spatial context
* **Characters**: Human and animals are not well supported by the model yet.
* **Blurry Images**: Blurry images result in ambiguous 3D interpretations.
* **Abstract Images**: Pure abstractions without recognizable spatial elements
* **Flat Graphics**: Logos, text, or 2D graphics without depth
* **Poor Lighting**: Very dark, overexposed, or unclear images
* **Images with Border**: Crop your image carefully to avoid flat patches of image border showing up in the 3D world.

Remember that Marble’s AI interprets your image creatively, so the generated world may expand beyond what’s visible in your original image, creating a fuller, explorable environment.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/export/gaussian-splat

## [​](#format) Format

We currently support **gaussian splats exports** for all our content.
You can find the file specs and sample files for different options in the
[Export File Specs](/guides/export-options/options#splats).

The lower-resolution files have been optimized to be as perceptually similar as possible to the higher-resolution files. For those of you working with applications where lighter compute is important, we encourage you to give this a try! You may convert these to .ply files [here](https://spz-to-ply.netlify.app) if needed.

## [​](#integration) Integration

The [Radiance Fields](https://radiancefields.com/3d-gaussian-splatting-engine-support) website provides a comprehensive overview of platforms and plugins supporting splat integration. Here is a non-exhaustive subset of tools and platforms that we’ve either tested ourselves or received positive feedback from our user community about.
Click on one of these sub-categories to get started!

[## Spark

*Build custom applications using the spark.js framework for three.js developers.*  
Provides the highest degree of control and customization for web-based applications. Perfect for creating VR experiences, interactive games, and custom visualization tools.](/guides/export-options/spark)

## Professional Software

*Great for professional studios or creators using well-known tools like Unreal Engine, Unity, Houdini, or Blender.*These integrate well with offline production pipelines in established 3D software ecosystems. They allow teams to fit Gaussian Splat workflows into existing VFX, animation, or game development pipelines without needing to build tooling from scratch.**[Unreal Engine](/guides/export-options/unreal)**,
**[Unity](/guides/export-options/unity)**,
**[Blender](/guides/export-options/blender)**,
**[Houdini](/guides/export-options/houdini)**

## Web Platforms (Coming Soon!)

*Great for artists or teams prioritizing one-stop solutions and fast iteration over deep customization.*  
These focus on ease of sharing and distribution, often requiring minimal setup. Perfect for quickly showcasing work or creating interactive experiences that can be accessed directly in a browser.

We greatly appreciate the contributions and feedback from our user community on these so far— if you have insights or experiences with other export options, please share them with us on Discord and we will update these resources as we go!

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/studio-tools/record

# [​](#record-creating-camera-animations) Record: Creating Camera Animations

Use Record to create smooth camera animations and capture cinematic flythroughs
of your worlds. Perfect for showcasing environments, creating trailers, or producing
professional presentations of your 3D scenes.

**Important: Data Persistence Limitation**Currently the trajectory does not persist. You **WILL lose the keyframes** when you leave the page. Similarly, you **WILL lose the enhanced video** if you leave the page. Stay on the page until your (enhanced) videos have finished downloading.

## [​](#getting-started-with-record) Getting Started with Record

The Studio Record interface provides comprehensive animation tools:

* **3D Viewport**: View your world with camera animation preview
* **Camera Frustum**: Yellow wireframe showing camera view and movement path
* **Animation Timeline**: Control playback, timing, and keyframes
* **Playback Controls**: Play, pause, and scrub through your animation
* **Export Tools**: Enhance and export your final video

## [​](#how-to-set-up-your-camera-animation) How to Set Up Your Camera Animation

Create smooth camera movements through your world:

1. **Position Your Camera**: Move to your desired starting viewpoint in the 3D viewport
2. **Set First Keyframe**: The camera frustum (yellow wireframe) shows your view cone
3. **Move to Next Position**: Navigate to where you want the camera to move
4. **Add More Keyframes**: Build your camera path with multiple positions
5. **Preview Movement**: The yellow path lines show your camera’s trajectory

## [​](#how-to-control-animation-timing) How to Control Animation Timing

Fine-tune the pacing of your camera movement:

1. **Use the Timeline**: The bottom timeline shows seconds
2. **Scrub Through Time**: Drag the blue playhead to preview different moments
3. **Adjust Keyframe Timing**: Move keyframes along the timeline to change pacing
4. **Set Animation Length**: Extend or shorten the total duration as needed
5. **Preview Timing**: Use playback controls to test your animation speed

## [​](#how-to-preview-your-animation) How to Preview Your Animation

Review your camera movement before recording:

1. **Click Play**: Use the  play button to start animation preview
2. **Pause and Adjust**: Use  pause to stop and make adjustments
3. **Scrub Timeline**: Drag the playhead to jump to specific moments
4. **Check Camera Path**: Watch the yellow frustum move along the path
5. **View from Animation**: The preview window shows your camera’s perspective

## [​](#how-to-record-and-export) How to Record and Export

Capture your final animation:

1. **Preview First**: Ensure your animation looks correct using the preview controls
2. **Use Enhance**: Click  **Enhance** to improve video quality and effects. Wait on this page until the enhance is done.
3. **Download Video**: Click  **Download** to download your final animation file

## [​](#faq) FAQ

### [​](#what-does-the-yellow-wireframe-represent) What does the yellow wireframe represent?

The **Camera Frustum** (yellow wireframe cone) shows exactly what your camera sees at each moment, including the field of view and viewing direction. The lines connecting different positions show your camera’s movement path.

### [​](#how-long-can-my-animation-be) How long can my animation be?

The timeline extends beyond 8 seconds, allowing for longer animations. However, longer videos may take more time to process and export.

### [​](#what-does-the-enhance-feature-do) What does the Enhance feature do?

**Enhance** applies post-processing effects like improved lighting, color grading, and visual effects to make your video look more professional and cinematic.

### [​](#can-i-edit-keyframes-after-creating-them) Can I edit keyframes after creating them?

Yes, you can move keyframes along the timeline to adjust timing, and reposition your camera at any keyframe to change the path.

### [​](#what-file-formats-can-i-export) What file formats can I export?

A mp4 video.

### [​](#how-do-i-create-smooth-camera-movements) How do I create smooth camera movements?

Focus on gentle curves rather than sharp angles, use consistent speeds between keyframes, and preview frequently to ensure the movement feels natural.

## [​](#keyboard-shortcuts-and-controls-reference) Keyboard Shortcuts and Controls Reference

Master the Studio Record interface with these keyboard shortcuts and button tooltips for efficient animation workflow.

### [​](#animation-keyframe-controls) Animation Keyframe Controls

Create and manage keyframes with these essential shortcuts:

* **F** -  Add keyframe at current camera position
* **U** -  Update selected keyframe to current camera position
* **Delete/Backspace** -  Delete selected keyframe

### [​](#timeline-playback-controls) Timeline Playback Controls

Navigate through your animation timeline efficiently:

* **Space** - / Toggle play/pause animation
* **G** -  Jump to beginning of timeline
* **H** -  Jump to previous keyframe
* **L** -  Jump to next keyframe
* **;** (semicolon) -  Jump to end of timeline

### [​](#seek-and-scrubbing-controls) Seek and Scrubbing Controls

Fine-tune your position in the animation:

* **J** -  Seek backward (hold to continue seeking)
* **K** -  Seek forward (hold to continue seeking)

### [​](#camera-movement-controls) Camera Movement Controls

Navigate your 3D world while setting up animations:

* **W** - Move Forward
* **A** - Move Left
* **S** - Move Backward
* **D** - Move Right
* **E** - Move Up
* **Q** - Move Down
* **Shift** - Speed Up movement

### [​](#view-controls) View Controls

Adjust your viewing perspective:

* **[** - Decrease Field of View (FOV)
* **]** - Increase Field of View (FOV)
* **0** - Return to Origin position

### [​](#timeline-interface-buttons) Timeline Interface Buttons

The timeline interface includes these interactive controls with tooltips:

#### [​](#playback-controls-section) Playback Controls Section

* “Jump to beginning (G)” - Moves playhead to start of timeline
* “Jump to previous keyframe (H)” - Moves playhead to previous keyframe
* / “Play” / “Pause (Space)” - Toggles animation playback
* “Jump to next keyframe (L)” - Moves playhead to next keyframe
* “Jump to end (;)” - Moves playhead to end of timeline

### [​](#pro-tips-for-efficient-animation-workflow) Pro Tips for Efficient Animation Workflow

1. **Add keyframes frequently** - Add keyframes with F as you explore to build smooth camera paths
2. **Preview with Space** - Constantly test your animation timing with the play shortcut
3. **Scrub with H/L** - Fine-tune timing by holding these keys to seek through your animation
4. **Speed up navigation** - Hold Shift while moving to quickly position your camera
5. **Reset with 0** - Return to origin if you get lost while positioning your camera

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/video-prompt

404

# Page Not Found

We couldn't find the page. Maybe you were looking for one of these pages below?

[Welcome to Marble](/index#welcome-to-marble)[Video prompt tips](/marble/create/prompt-guides/video-prompt#)[Image prompt tips](/marble/create/prompt-guides/image-prompt#getting-started-with-image-prompts)

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/chisel-tools

# [​](#chisel-scene-3d-world-blocking) Chisel Scene: 3D World Blocking

Use the Chisel Scene to quickly block out 3D spaces and create the foundation for detailed worlds. This tool lets you build geometric layouts that serve as the base structure for your generated environments.

## [​](#getting-started-with-chisel-scene) Getting Started with Chisel Scene

Enter Chisel from the omnibox, select  3D Input mode, and enter Chisel by  Start.
The Chisel Scene interface provides essential tools for 3D world creation:

* **3D Viewport**: The main canvas where you build your world geometry
* **Geometry Panel**: Access tools like Walls and Panorama Camera
* **Template Options**: Upload GLB or FBX models to start from existing geometry
* **Generation Controls**: Text prompt input and Generate button

## [​](#how-to-block-out-walls-for-a-room) How to Block Out Walls for a Room

To create a basic room structure:

1. **Start with the Wall Tool**: In the Geometry panel, select **Walls**
2. **Draw Wall Boundaries**: Click and drag in the 3D Viewport to define wall perimeters
3. **Close the Room**: Connect your final wall segment back to the starting point
4. **Adjust Height**: Use the wall handles to modify wall height as needed
5. **Add Doorways**: Create openings by selecting wall segments and adjusting them

## [​](#how-to-set-up-camera-views) How to Set Up Camera Views

Position your viewpoint for world generation:

1. **Select Panorama Camera**: Click on **Panorama Camera** in the Geometry panel
2. **Position the Camera**: Place it where you want the generated view to originate
3. **Adjust Height**: Drag the camera vertically to set the viewing height
4. **Orient the View**: Rotate the camera to face the desired direction

## [​](#how-to-upload-reference-geometry) How to Upload Reference Geometry

Start with existing 3D models:

1. **Click Upload**: Select **Upload a glb or fbx model** in the template section
2. **Choose Your File**: Browse and select your 3D model file
3. **Position the Model**: The uploaded geometry appears in the viewport
4. **Scale if Needed**: Adjust the model size using the transformation handles

## [​](#how-to-generate-your-world) How to Generate Your World

Transform your blocked-out geometry into a detailed environment:

1. **Add a Text Prompt**: In the text input, describe your desired environment (e.g., “modern kitchen”)
2. **Click Generate**: Press the **Generate** button to create your world
3. **Wait for Processing**: The system will generate detailed geometry based on your blocks and prompt

## [​](#faq) FAQ

### [​](#what-is-the-chisel-tool) What is the Chisel Tool?

The **Chisel** tool lets you modify and refine existing geometry by carving, extruding, or reshaping elements.

### [​](#what-does-the-extrude-tool-do) What does the Extrude Tool do?

The **Extrude Tool** (Z key) extends selected surfaces outward or inward, allowing you to create depth and volume from flat shapes.

### [​](#what-is-the-wall-tool-used-for) What is the Wall Tool used for?

The **Wall Tool** (X key) specifically creates vertical wall segments, perfect for defining room boundaries and architectural elements.

### [​](#how-do-i-delete-geometry) How do I delete geometry?

Use the **Delete** tool () to remove selected elements from your scene. You can also press the **Delete** key after selecting objects.

### [​](#what-does-the-undo-function-do) What does the Undo function do?

**Undo** (⌘Z) reverses your last action, letting you step back through your modeling history if you make mistakes.

### [​](#when-should-i-use-public-mode) When should I use Public Mode?

Enable **Public Mode** when you want your created world to be visible to other users in the community gallery. Leave it disabled for private projects.

### [​](#what-file-formats-can-i-upload) What file formats can I upload?

The template uploader supports **GLB** and **FBX** file formats for 3D models. These are common formats exported from most 3D modeling software.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/prompt-guides/pano-prompt

# [​](#creating-worlds-from-panoramic-images) Creating Worlds from Panoramic Images

Upload 360° panoramic images to create immersive 3D worlds with maximum control over your environment.
Panoramas provide complete spatial information, allowing for more accurate and detailed world generation than standard images.

## [​](#getting-started-with-panorama-upload) Getting Started with Panorama Upload

You can obtain a full 360 equirectangular panorama by capturing it with a 360 camera,
rendering it from a 3D software, or downloading from a Marble world.
To create a world with panorama, you can simply drag and drop it to the omnibox; it
will expand with  2D input mode.
Check the left and right edge of your panorama is continuous for best results.
If the image is successfully recognized as a panorama, a 
icon will appear on the image thumbnail. You can then start a
generation by clicking on  Create.

## [​](#troubleshooting-common-issues) Troubleshooting Common Issues

### [​](#”image-is-not-recognized-as-a-panorama”) ”Image is not recognized as a panorama”

* **Check Aspect Ratio**: Ensure exactly 2:1 width to height ratio
* **Check sky and ground coverage**: Phone panoramas often lack full vertical 180 coverage

### [​](#”seam-visible-in-generated-world”) ”Seam visible in generated world”

* **Fix Source Panorama**: Repair edge alignment in image editing software,
* **“Use advanced editing”**: to edit panorama with AI assistance on Marble.

## [​](#frequently-asked-questions) Frequently Asked Questions

### [​](#are-multi-panorama-inputs-supported) Are multi panorama inputs supported?

* **Not directly**: Multiple panoramic images cannot be uploaded together in a single generation. However, you can create larger worlds by generating a world from each panorama separately, then stitching them together using [Studio Compose](/marble/create/studio-tools/compose).

Panoramic uploads give you the most control over the final world layout, as the 360° image provides complete spatial information for the AI to work with.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/prompt-guides/video-prompt

# [​](#creating-worlds-from-video) Creating Worlds from Video

Upload short videos to create immersive 3D worlds with rich spatial information.
Videos provide multiple perspectives of your space, allowing the AI to understand depth
and spatial relationships better than a single images alone.

## [​](#getting-started-with-video-upload) Getting Started with Video Upload

Drag a short video of a static space into the omnibox; it will expand with  2D input mode,
which allows you to start a generation by clicking on  Create.
For video file specifications, see [Prompt Guidelines →](/marble/create/prompt-guides)

## [​](#best-practices-for-video-capture) Best Practices for Video Capture

### [​](#camera-movement-guidelines) Camera Movement Guidelines

* **Rotation Focus**: Rotate the camera to cover a large viewing angle
* **Avoid motion blur**: Use steady, controlled camera movements to avoid excessive motion blur
* **Wide Coverage**: Aim to capture 180° to 360° of the space
* **Continuous Shot**: Record one uninterrupted take of the space

### [​](#camera-settings) Camera Settings

* **Fixed Focal Length**: Avoid zooming in or out during recording
* **Fixed Exposure**: Avoid changing exposure during recording

Video provides the richer spatial information for world generation, as the AI can analyze multiple perspectives and understand how different elements relate in 3D space.

---

## 🔗 Fonte: https://docs.worldlabs.ai/guides/prompt_guidelines

404

# Page Not Found

We couldn't find the page. Maybe you were looking for one of these pages below?

[Prompt guidelines](/marble/create/prompt-guides/index#)[Pano prompt tips](/marble/create/prompt-guides/pano-prompt#)[Image prompt tips](/marble/create/prompt-guides/image-prompt#)

---

## 🔗 Fonte: https://docs.worldlabs.ai/api/index

## [​](#quickstart) Quickstart

1

Get an API key

1

Sign in to the [World Labs Platform](https://platform.worldlabs.ai) with your Marble account.If you don’t have a Marble account, you’ll be prompted to create one.

2

Visit the [billing page](https://platform.worldlabs.ai/billing).Add a payment method to your account and then purchase some credits to get started.

3

Generate an API key from the [API keys page](https://platform.worldlabs.ai/api-keys).

Save your API key in a secure location and never share it with anyone.

2

Create your first world

To verify your development setup is working, we recommend creating a world from only a text prompt.You can also create a world from an image, multiple images of the same scene, or a video.

Iterate more quickly with `Marble 0.1-mini` (equivalent to Draft in Marble).This example uses `Marble 0.1-plus` by default for best quality. If you’re iterating or debugging, you can use `Marble 0.1-mini` for much faster (30-45s) and cheaper generations.To use it, add `"model": "Marble 0.1-mini"` to your request body.

* Text input
* Image input
* Multi-image input
* Video input

1

Make a `POST` request to the [`/marble/v1/worlds:generate`](/api/reference/worlds/generate) endpoint.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "Mystical Forest",
    "world_prompt": {
      "type": "text",
      "text_prompt": "A mystical forest with glowing mushrooms"
    }
  }'
```

This will return an Operation object.

Copy

```python
{
  "operation_id": "20bffbb1-4ba7-453f-a116-93eaw1a6843e",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z",
  "expires_at": "2025-01-15T11:30:00Z",
  "done": false,
  "error": null,
  "metadata": null,
  "response": null
}
```

2

Poll the [`/marble/v1/operations/{operation_id}`](/api/reference/operations/get) endpoint until the operation is done.

Copy

```python
curl -X GET 'https://api.worldlabs.ai/marble/v1/operations/20bffbb1-4ba7-453f-a116-93eaw1a6843e' \
  -H 'WLT-Api-Key: YOUR_API_KEY'
```

This will return an Operation object. If the operation is not done, it will return a `200` status code and the Operation object will have a `done` field set to `false`:

Copy

```python
{
  "operation_id": "20bffbb1-4ba7-453f-a116-93eaw1a6843e",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z",
  "expires_at": "2025-01-15T11:30:00Z",
  "done": false,
  "error": null,
  "metadata": {
    "progress": { "status": "IN_PROGRESS", "description": "World generation in progress" },
    "world_id": "dc2c65e4-68d3-4210-a01e-7a54cc9ded2a"
  },
  "response": null
}
```

World generation should take **about 5 minutes** to complete. Once the world is generated, the `done` field will be set to `true` and the `response` field will contain the generated World:

Copy

```python
{
  "operation_id": "20bffbb1-4ba7-453f-a116-93eab1a6843e",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:35:00Z",
  "expires_at": "2025-01-15T11:30:00Z",
  "done": true,
  "error": null,
  "metadata": {
    "progress": {
      "status": "SUCCEEDED",
      "description": "World generation completed successfully"
    },
    "world_id": "dc2c65e4-68d3-4210-a01e-7a54cc9ded2a"
  },
  "response": {
    "id": "dc2c65e4-68d3-4210-a01e-7a54cc9ded2a",
    "display_name": "",
    "tags": null,
    "world_marble_url": "https://marble.worldlabs.ai/world/dc2c65e4-68d3-4210-a01e-7a54cc9ded2a",
    "assets": {
      "caption": "The scene is a fantastical forest...",
      "thumbnail_url": "<thumbnail_url>",
      "splats": {
        "spz_urls": {
          "500k": "<500k_spz_url>",
          "100k": "<100k_spz_url>",
          "full_res": "<full_res_spz_url>"
        }
      },
      "mesh": {
        "collider_mesh_url": "<collider_mesh_url>"
      },
      "imagery": {
        "pano_url": "<pano_url>"
      }
    },
    "created_at": null,
    "updated_at": null,
    "permission": null,
    "world_prompt": null,
    "model": null
  }
}
```

The `response` field contains a snapshot of the World at the time the operation completed. This allows you to access the generated assets without making a separate API call. Note that some fields like `display_name`, `created_at`, `updated_at`, `world_prompt`, and `model` may be empty or null in this snapshot. Use the [`GET /marble/v1/worlds/{world_id}`](/api/reference/worlds/get) endpoint to fetch the complete, up-to-date world.

You can view the generated world in Marble at `https://marble.worldlabs.ai/world/{world_id}`.

3

(Optional) Get the latest world

If you need to fetch the most up-to-date version of the world later, use the `world_id` to retrieve it.

Request

Copy

```python
curl -X GET 'https://api.worldlabs.ai/marble/v1/worlds/dc2c65e4-68d3-4210-a01e-7a54cc9ded2a' \
  -H 'WLT-Api-Key: YOUR_API_KEY'
```

This returns the latest version of the world:

Copy

```python
{
  "world": {
    "id": "dc2c65e4-68d3-4210-a01e-7a54cc9ded2a",
    "display_name": "Mystical Forest",
    "tags": null,
    "world_marble_url": "https://marble.worldlabs.ai/world/dc2c65e4-68d3-4210-a01e-7a54cc9ded2a",
    "assets": {
      "caption": "The scene is a fantastical forest...",
      "thumbnail_url": "<thumbnail_url>",
      "splats": {
        "spz_urls": {
          "500k": "<500k_spz_url>",
          "full_res": "<full_res_spz_url>",
          "100k": "<100k_spz_url>"
        }
      },
      "mesh": {
        "collider_mesh_url": "<collider_mesh_url>"
      },
      "imagery": {
        "pano_url": "<pano_url>"
      }
    },
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:35:00Z",
    "permission": null,
    "world_prompt": {
      "type": "text",
      "text_prompt": "The scene is a fantastical forest..."
    },
    "model": "Marble 0.1-plus"
  }
}
```

The world object includes:

* `assets.splats.spz_urls`: 3D Gaussian splat files in SPZ format (100k, 500k, and full resolution)
* `assets.mesh.collider_mesh_url`: Collider mesh in GLB format
* `assets.imagery.pano_url`: Panorama image
* `assets.caption`: AI-generated description of the world
* `assets.thumbnail_url`: Thumbnail image for the world
* `world_prompt`: The prompt used to generate the world (may be recaptioned)
* `model`: The model used for generation

You can create a world from a single image using either a public URL or by uploading a local file.Recommended image formats: `jpg`, `jpeg`, `png`, `webp`.

* From URL
* From local file

If your image is already hosted at a public URL, you can reference it directly.

1

Make a `POST` request to the [`/marble/v1/worlds:generate`](/api/reference/worlds/generate) endpoint with your image URL.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "My Image World",
    "world_prompt": {
      "type": "image",
      "image_prompt": {
        "source": "uri",
        "uri": "https://example.com/my-image.jpg"
      },
      "text_prompt": "A beautiful landscape"
    }
  }'
```

This returns an Operation object. Poll the operation as shown in the text input example until `done` is `true`. The completed operation’s `response` field will contain the generated World.

To use a local image file, first upload it as a media asset, then reference it in your generation request.

1

Prepare the upload

Make a `POST` request to [`/marble/v1/media-assets:prepare_upload`](/api/reference/media-assets/prepare-upload) to get a signed upload URL.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/media-assets:prepare_upload' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "file_name": "my-image.jpg",
    "kind": "image",
    "extension": "jpg"
  }'
```

This returns the media asset and upload information:

Copy

```python
{
  "media_asset": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "file_name": "my-image.jpg",
    "kind": "image",
    "extension": "jpg",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": null,
    "metadata": null
  },
  "upload_info": {
    "upload_url": "<signed_upload_url>",
    "upload_method": "PUT",
    "required_headers": {
      "x-goog-content-length-range": "0,1048576000"
    }
  }
}
```

2

Upload the file

Upload your image to the signed URL using the method and headers from the response.

Request

Copy

```python
curl -X PUT '<signed_upload_url>' \
  -H 'x-goog-content-length-range: 0,1048576000' \
  --data-binary '@/path/to/my-image.jpg'
```

3

Generate the world

Use the `media_asset_id` from Step 1 to generate a world.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "My Image World",
    "world_prompt": {
      "type": "image",
      "image_prompt": {
        "source": "media_asset",
        "media_asset_id": "550e8400-e29b-41d4-a716-446655440000"
      },
      "text_prompt": "A beautiful landscape"
    }
  }'
```

This returns an Operation object. Poll the operation as shown in the text input example until `done` is `true`. The completed operation’s `response` field will contain the generated World.

The `text_prompt` field is optional. If omitted, a caption will be automatically generated from your image.

Set `is_pano: true` in the `image_prompt` if your input image is a panorama.

You can create a world from multiple images of the same scene, each with an optional azimuth (horizontal angle in degrees).Recommended image formats: `jpg`, `jpeg`, `png`, `webp`.

* From URLs
* From local files

If your images are already hosted at public URLs, you can reference them directly.

1

Make a `POST` request to the [`/marble/v1/worlds:generate`](/api/reference/worlds/generate) endpoint with your image URLs and their azimuth positions.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "My Multi-Image World",
    "world_prompt": {
      "type": "multi-image",
      "multi_image_prompt": [
        {
          "azimuth": 0,
          "content": {
            "source": "uri",
            "uri": "https://example.com/front.jpg"
          }
        },
        {
          "azimuth": 180,
          "content": {
            "source": "uri",
            "uri": "https://example.com/back.jpg"
          }
        }
      ],
      "text_prompt": "A cozy living room"
    }
  }'
```

This returns an Operation object. Poll the operation as shown in the text input example until `done` is `true`. The completed operation’s `response` field will contain the generated World.

To use local image files, first upload each as a media asset, then reference them in your generation request.

1

Prepare and upload each image

For each image, prepare the upload and upload the file as shown in the [image input example](#from-local-file).

Request

Copy

```python
# Prepare upload for first image
curl -X POST 'https://api.worldlabs.ai/marble/v1/media-assets:prepare_upload' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "file_name": "front.jpg",
    "kind": "image",
    "extension": "jpg"
  }'

# Upload the file to the returned upload_url
curl -X PUT '<upload_url>' \
  -H 'Content-Type: image/jpeg' \
  --data-binary '@/path/to/front.jpg'

# Repeat for each additional image
```

2

Generate the world

Use the media asset IDs to generate a world.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "My Multi-Image World",
    "world_prompt": {
      "type": "multi-image",
      "multi_image_prompt": [
        {
          "azimuth": 0,
          "content": {
            "source": "media_asset",
            "media_asset_id": "<front_image_id>"
          }
        },
        {
          "azimuth": 180,
          "content": {
            "source": "media_asset",
            "media_asset_id": "<back_image_id>"
          }
        }
      ],
      "text_prompt": "A cozy living room"
    }
  }'
```

This returns an Operation object. Poll the operation as shown in the text input example until `done` is `true`. The completed operation’s `response` field will contain the generated World.

The `azimuth` field specifies the horizontal angle (in degrees) where the image was taken. Use `0` for front, `90` for right, `180` for back, `270` for left.

The `text_prompt` field is optional. If omitted, a caption will be automatically generated.

You can create a world from a video using either a public URL or by uploading a local file.Recommended video formats: `mp4`, `mov`, `mkv`.

* From URL
* From local file

If your video is already hosted at a public URL, you can reference it directly.

1

Make a `POST` request to the [`/marble/v1/worlds:generate`](/api/reference/worlds/generate) endpoint with your video URL.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "My Video World",
    "world_prompt": {
      "type": "video",
      "video_prompt": {
        "source": "uri",
        "uri": "https://example.com/my-video.mp4"
      },
      "text_prompt": "A scenic mountain landscape"
    }
  }'
```

This returns an Operation object. Poll the operation as shown in the text input example until `done` is `true`. The completed operation’s `response` field will contain the generated World.

To use a local video file, first upload it as a media asset, then reference it in your generation request.

1

Prepare the upload

Make a `POST` request to [`/marble/v1/media-assets:prepare_upload`](/api/reference/media-assets/prepare-upload) to get a signed upload URL.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/media-assets:prepare_upload' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "file_name": "my-video.mp4",
    "kind": "video",
    "extension": "mp4"
  }'
```

This returns the media asset and upload information:

Copy

```python
{
  "media_asset": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "file_name": "my-video.mp4",
    "kind": "video",
    "extension": "mp4",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": null,
    "metadata": null
  },
  "upload_info": {
    "upload_url": "<signed_upload_url>",
    "upload_method": "PUT",
    "required_headers": {
      "x-goog-content-length-range": "0,1048576000"
    }
  }
}
```

2

Upload the file

Upload your video to the signed URL using the method and headers from the response.

Request

Copy

```python
curl -X PUT '<signed_upload_url>' \
  -H 'x-goog-content-length-range: 0,1048576000' \
  --data-binary '@/path/to/my-video.mp4'
```

3

Generate the world

Use the `media_asset_id` from Step 1 to generate a world.

Request

Copy

```python
curl -X POST 'https://api.worldlabs.ai/marble/v1/worlds:generate' \
  -H 'Content-Type: application/json' \
  -H 'WLT-Api-Key: YOUR_API_KEY' \
  -d '{
    "display_name": "My Video World",
    "world_prompt": {
      "type": "video",
      "video_prompt": {
        "source": "media_asset",
        "media_asset_id": "550e8400-e29b-41d4-a716-446655440000"
      },
      "text_prompt": "A scenic mountain landscape"
    }
  }'
```

This returns an Operation object. Poll the operation as shown in the text input example until `done` is `true`. The completed operation’s `response` field will contain the generated World.

The `text_prompt` field is optional. If omitted, a caption will be automatically generated from your video.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/export/gaussian-splat/blender

[](https://mintcdn.com/worldlabs/MLFIZQFuNhLp0_rH/media/marble-export-blender.mp4?fit=max&auto=format&n=MLFIZQFuNhLp0_rH&q=85&s=9d67abd67dee3e069d3bfca1f6db9645)
There are a couple of Blender plugins available, and we’ve looked into the following.

KIRI Engine

The [**KIRI Engine**](https://www.kiriengine.app/blender-addon/3dgs-render) plugin for Blender is the most well-known and actively maintained option! We’ve verified it works on Blender 4.2+.

Reshot AI

Some users reported a better experience working with the [**Reshot AI**](https://github.com/ReshotAI/gaussian-splatting-blender-addon) plugin, preferring it over the more maintained KIRI engine plugin, and stating that it was more performant and flexible.

SplatForge

The [SplatForge](https://splatforge.cloud) plugin is the most performant/responsive Blender option we’ve seen so far! However, the render pass is entirely separate from Blender’s main render loops (EEVEE/Cycles), so compositer graph workarounds are needed to combine splats with other Blender geometry.

Jetset iOS

The [Jetset iOS app](https://docs.lightcraft.pro/tutorials/blender-workflows/gaussian-splat-setup) allows you to first set up your splats in Blender via a modified Reshot AI plugin, then do virtual production on your phone! We’ve had a **ton** of fun with this one.

If you have had positive or negative experiences with any of these plugins, we appreciate your feedback and will be updating this page as we go.


Community FAQ

### [​](#q-why-does-the-lighting-look-different-in-point-cloud-vs-splat-mode-in-reshotai-the-lighting-is-darker-in-splat-mode) Q: Why does the lighting look different in point cloud vs splat mode in ReshotAI? The lighting is darker in splat mode.

**A:** This is unavoidable due to how splats are represented as differently sized geometry in point cloud vs splat mode. In splat mode, the per-splat meshes are denser, so they occlude the lighting in the scene more. Neither lighting mode is “correct” - they’re just different representations.There are two solutions:

1. **Place lights within the scene:** Treat the splats as solid geometry and position your lights strictly within the scene.
2. **Make lights ignore splats for shadow-casting:** Click on the light → Object tab → Shading → Shadow Linking, then drag the splats into a new collection in that tab and uncheck it. This prevents the splats from casting shadows on other objects in your scene.
   [discord discussion](https://discord.com/channels/1288765343552110637/1448516454055153674)

---

### [​](#q-how-does-reshotai-compare-to-other-blender-plugins) Q: How does ReshotAI compare to other Blender plugins?

**A:** Based on user feedback, ReshotAI is the easiest and most straightforward option out of the plugins tested. While it may not look as great in point cloud mode (giving the Gaussian splats a more “dreamy” look), users have reported preferring it over other options like KIRI Engine and GS loader for its simplicity and ease of use. However, note that the GS loader method doesn’t emit lights for objects in the scene, so it relies entirely on your scene lighting.
[discord discussion](https://discord.com/channels/1288765343552110637/1448516454055153674)

---

## 🔗 Fonte: https://docs.worldlabs.ai/guides/export-options/blender

404

# Page Not Found

We couldn't find the page. Maybe you were looking for one of these pages below?

[Exporting to Blender](/marble/export/gaussian-splat/blender#exporting-to-blender)[Welcome to Marble](/index#download-options)[Exporting to Unreal Engine](/marble/export/gaussian-splat/unreal#exporting-to-unreal-engine)

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/pano-prompt

404

# Page Not Found

We couldn't find the page. Maybe you were looking for one of these pages below?

[Pano prompt tips](/marble/create/prompt-guides/pano-prompt#)[Welcome to Marble](/index#welcome-to-marble)[Image prompt tips](/marble/create/prompt-guides/image-prompt#getting-started-with-image-prompts)

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/export/gaussian-splat/spark

For the three.js devs out there, check out [**spark**](https://sparkjs.dev/)! Some examples of what you can build on spark include [**lofi worlds**](https://lofiworlds.ai/marble) in VR, and a [**first person shooting game**](https://github.com/bmild/spark-physics) with animated characters.
[](https://mintcdn.com/worldlabs/MLFIZQFuNhLp0_rH/media/marble-export-spark.mp4?fit=max&auto=format&n=MLFIZQFuNhLp0_rH&q=85&s=738fa969fbf251a1391413c2b6441462)
We highly recommend this option. It is also what our own website is built off of, so you’ll have the most native experience utilitizing this library. spark devs are also hanging out in our discord and are ready to answer your questions!

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/chisel-tools/chisel-basics

# [​](#chisel-scene-3d-world-blocking) Chisel Scene: 3D World Blocking

Use the Chisel Scene to quickly block out 3D spaces and create the foundation for detailed worlds. This tool lets you build geometric layouts that serve as the base structure for your generated environments.

## [​](#getting-started-with-chisel-scene) Getting Started with Chisel Scene

Enter Chisel from the omnibox, select  3D Input mode, and enter Chisel by  Start.
The Chisel Scene interface provides essential tools for 3D world creation:

* **3D Viewport**: The main canvas where you build your world geometry
* **Geometry Panel**: Access tools like Walls and Panorama Camera
* **Template Options**: Upload GLB or FBX models to start from existing geometry
* **Generation Controls**: Text prompt input and Generate button

## [​](#how-to-block-out-walls-for-a-room) How to Block Out Walls for a Room

To create a basic room structure:

1. **Start with the Wall Tool**: In the Geometry panel, select **Walls**
2. **Draw Wall Boundaries**: Click and drag in the 3D Viewport to define wall perimeters
3. **Close the Room**: Connect your final wall segment back to the starting point
4. **Adjust Height**: Use the wall handles to modify wall height as needed
5. **Add Doorways**: Create openings by selecting wall segments and adjusting them

## [​](#how-to-set-up-camera-views) How to Set Up Camera Views

Position your viewpoint for world generation:

1. **Select Panorama Camera**: Click on **Panorama Camera** in the Geometry panel
2. **Position the Camera**: Place it where you want the generated view to originate
3. **Adjust Height**: Drag the camera vertically to set the viewing height
4. **Orient the View**: Rotate the camera to face the desired direction

## [​](#how-to-upload-reference-geometry) How to Upload Reference Geometry

Start with existing 3D models:

1. **Click Upload**: Select **Upload a glb or fbx model** in the template section
2. **Choose Your File**: Browse and select your 3D model file
3. **Position the Model**: The uploaded geometry appears in the viewport
4. **Scale if Needed**: Adjust the model size using the transformation handles

## [​](#how-to-generate-your-world) How to Generate Your World

Transform your blocked-out geometry into a detailed environment:

1. **Add a Text Prompt**: In the text input, describe your desired environment (e.g., “modern kitchen”)
2. **Click Generate**: Press the **Generate** button to create your world
3. **Wait for Processing**: The system will generate detailed geometry based on your blocks and prompt

## [​](#faq) FAQ

### [​](#what-is-the-chisel-tool) What is the Chisel Tool?

The **Chisel** tool lets you modify and refine existing geometry by carving, extruding, or reshaping elements.

### [​](#what-does-the-extrude-tool-do) What does the Extrude Tool do?

The **Extrude Tool** (Z key) extends selected surfaces outward or inward, allowing you to create depth and volume from flat shapes.

### [​](#what-is-the-wall-tool-used-for) What is the Wall Tool used for?

The **Wall Tool** (X key) specifically creates vertical wall segments, perfect for defining room boundaries and architectural elements.

### [​](#how-do-i-delete-geometry) How do I delete geometry?

Use the **Delete** tool () to remove selected elements from your scene. You can also press the **Delete** key after selecting objects.

### [​](#what-does-the-undo-function-do) What does the Undo function do?

**Undo** (⌘Z) reverses your last action, letting you step back through your modeling history if you make mistakes.

### [​](#when-should-i-use-public-mode) When should I use Public Mode?

Enable **Public Mode** when you want your created world to be visible to other users in the community gallery. Leave it disabled for private projects.

### [​](#what-file-formats-can-i-upload) What file formats can I upload?

The template uploader supports **GLB** and **FBX** file formats for 3D models. These are common formats exported from most 3D modeling software.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/image-prompt

404

# Page Not Found

We couldn't find the page. Maybe you were looking for one of these pages below?

[Image prompt tips](/marble/create/prompt-guides/image-prompt#getting-started-with-image-prompts)[Welcome to Marble](/index#welcome-to-marble)[Multi-image prompt tips](/marble/create/prompt-guides/multi-image-prompt#)

---

## 🔗 Fonte: https://docs.worldlabs.ai/guides/export-options/spark

404

# Page Not Found

We couldn't find the page. Maybe you were looking for one of these pages below?

[Exporting to Dev Frameworks](/marble/export/gaussian-splat/spark#)[Exporting to Blender](/marble/export/gaussian-splat/blender#exporting-to-blender)[Welcome to Marble](/index#download-options)

---

## 🔗 Fonte: https://docs.worldlabs.ai/guides/export-options/unity

404

# Page Not Found

We couldn't find the page. Maybe you were looking for one of these pages below?

[Exporting to Unity](/marble/export/gaussian-splat/unity#exporting-to-unity)[Exporting to Blender](/marble/export/gaussian-splat/blender#exporting-to-blender)[Exporting to Dev Frameworks](/marble/export/gaussian-splat/spark#)

---

## 🔗 Fonte: https://docs.worldlabs.ai/guides/export-options/unreal

404

# Page Not Found

We couldn't find the page. Maybe you were looking for one of these pages below?

[Exporting to Unreal Engine](/marble/export/gaussian-splat/unreal#exporting-to-unreal-engine)[Exporting to Blender](/marble/export/gaussian-splat/blender#exporting-to-blender)[Exporting to Dev Frameworks](/marble/export/gaussian-splat/spark#)

---

## 🔗 Fonte: https://docs.worldlabs.ai/guides/export-options/options

404

# Page Not Found

We couldn't find the page. Maybe you were looking for one of these pages below?

[Exporting to Blender](/marble/export/gaussian-splat/blender#exporting-to-blender)[Exporting to Dev Frameworks](/marble/export/gaussian-splat/spark#)[Welcome to Marble](/index#download-options)

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/export/gaussian-splat/unreal

[](https://mintcdn.com/worldlabs/MLFIZQFuNhLp0_rH/media/marble-export-unreal.mp4?fit=max&auto=format&n=MLFIZQFuNhLp0_rH&q=85&s=4a1abd9361819313e8ec0f30bdcba0c5)
There are a couple Unreal plugins currently available for Windows.

Postshot (Recommended)

The [**Postshot**](https://www.jawset.com/docs/d/Postshot+User+Guide/Unreal+Engine+Integration) plugin for Unreal works reliably (we’ve verified it works on UE5.2)! A free version is available, but you need to upgrade for the full set of functionality and for commercial use.  
  
It currently can only be run on Windows machines that have the standalone Postshot software installed. You’ll need to import .ply files into Postshot and save out in postshot format (.psht) before loading into Unreal.

Volinga (Recommended)

The paid [**Volinga**](https://web.volinga.ai/#VolingaPlugin) plugin has been a popular option amongst our virtual production users and comes with additional features specific to virtual production.

Akiya

The [**Akiya**](https://vrlab.akiya-souken.co.jp/en/products/threedgaussianplugin/) plugin works pretty well! We suggest considering this option as well, but it is slightly more costly than Postshot and Volinga.

Luma / XVerse

While the [XVerse](https://github.com/xverse-engine/XScene-UEPlugin) and [Luma](https://www.fab.com/listings/b52460e0-3ace-465e-a378-495a5531e318) plugins are completely free, they are not actively maintained and our users have had partial-but-limited success with these.In particular, XVerse is functional on UE5.2 but may come with some visual artefacts from under-the-hood aggressive optimizing / downsampling!

If you have had positive or negative experiences with any of these plugins, we appreciate your feedback and will be updating this page as we go.


Community FAQ

### [​](#q-which-unreal-engine-plugin-supports-depth-of-field-with-splats-and-meshes-together) Q: Which Unreal Engine plugin supports depth of field with splats and meshes together?

**A:** For depth of field support, **Volinga** is potentially the best option, especially for virtual production use cases. The **3D Gaussians Plugin** (Akiya) also supports depth of field and works with nDisplay. Note that Postshot didn’t work well with nDisplay according to user reports. [discord discussion](https://discord.com/channels/1288765343552110637/1422034485934821497)

---

### [​](#q-how-can-i-get-depth-of-field-to-work-with-splats-in-unreal-engine) Q: How can I get depth of field to work with splats in Unreal Engine?

**A:** You can change the splat material from translucent to masked with AA Temporal Dither. This allows depth of field to work correctly, but note that it will slightly lower the visual quality compared to translucent materials. To do this, open the large Niagara node and look at the bottom section where you’ll see the material your particles use. Change the material blend mode from translucent to masked and enable AA Temporal Dither. [discord discussion](https://discord.com/channels/1288765343552110637/1422034485934821497)

---

### [​](#q-why-do-my-splats-look-low-resolution-in-unreal-compared-to-viewing-them-on-the-marble-site) Q: Why do my splats look low resolution in Unreal compared to viewing them on the Marble site?

**A:** The **XVerse** plugin does internal downsampling that causes artifacts and reduces splat density. This is a known issue with that plugin. **Postshot** doesn’t have this low resolution issue. Also, make sure you’re not downloading files as “SPZ Low-res” format, as that will naturally have fewer splats. [discord discussion](https://discord.com/channels/1288765343552110637/1422034485934821497)

---

### [​](#q-does-postshot-add-a-watermark-to-my-unreal-engine-scenes) Q: Does Postshot add a watermark to my Unreal Engine scenes?

**A:** Yes, Postshot implements a watermark icon in the Unreal Engine scene when you import a .psht file. This watermark appears in the scene view. [discord discussion](https://discord.com/channels/1288765343552110637/1422034485934821497)

---

### [​](#q-can-i-still-use-the-luma-plugin-for-unreal-engine) Q: Can I still use the Luma plugin for Unreal Engine?

**A:** No, Luma no longer supports its Unreal Engine plugin and it won’t work properly. The plugin was discontinued and is not actively maintained. Even in UE 5.3 (the last supported version), the plugin doesn’t function correctly. [discord discussion](https://discord.com/channels/1288765343552110637/1422034485934821497)

---

### [​](#q-how-can-i-convert-spz-files-to-ply-format-for-use-with-different-plugins) Q: How can I convert SPZ files to PLY format for use with different plugins?

**A:** You can use the online converter at <https://spz-to-ply.netlify.app/> to convert SPZ files to PLY format. This is useful if you need to use a plugin that requires PLY format or if you’re experiencing issues with SPZ files. [discord discussion](https://discord.com/channels/1288765343552110637/1422034485934821497)

---

### [​](#q-which-plugin-works-best-for-virtual-production-with-ndisplay) Q: Which plugin works best for virtual production with nDisplay?

**A:** **Volinga** is the recommended option for virtual production and nDisplay compatibility. Postshot had issues with nDisplay according to user reports. The **3D Gaussians Plugin** (Akiya) also supports nDisplay and depth of field, though it’s more expensive. [discord discussion](https://discord.com/channels/1288765343552110637/1422034485934821497)

---

### [​](#q-i’m-getting-texture-errors-when-importing-ply-files-with-xv3dgs-in-unreal-engine-5-5-is-this-normal) Q: I’m getting texture errors when importing PLY files with XV3DGS in Unreal Engine 5.5. Is this normal?

**A:** Yes, this is a known issue. In UE 5.5, XV3DGS shows texture errors when importing PLY files. On first import, you may see an empty cube, and after reloading, you may see a gray mesh. This is expected behavior with this plugin in 5.5. [discord discussion](https://discord.com/channels/1288765343552110637/1422034485934821497)

---

### [​](#q-my-material-status-shows-“none”-after-importing-with-xv3dgs-will-anything-work) Q: My material status shows “none” after importing with XV3DGS. Will anything work?

**A:** If the material status is “none”, the splats won’t render properly. Try exporting your Marble world as SPZ format and converting it to PLY using <https://spz-to-ply.netlify.app/> before importing. Make sure you haven’t modified the particle material or textures in the import folder. [discord discussion](https://discord.com/channels/1288765343552110637/1422034485934821497)

---

### [​](#q-what’s-the-best-plugin-for-depth-of-field-and-ndisplay-support-if-i’m-willing-to-pay) Q: What’s the best plugin for depth of field and nDisplay support if I’m willing to pay?

**A:** The **3D Gaussians Plugin** (Akiya) is expensive but offers the most reliable solution. It supports depth of field, works with nDisplay, has an automatic splitting system to divide scenes into multiple Niagara effects for full quality, and provides better quality than XVerse. It’s less problematic than other plugins according to user reports. [discord discussion](https://discord.com/channels/1288765343552110637/1422034485934821497)

---

### [​](#q-can-i-change-the-material-settings-in-xverse/xscene-ueplugin-to-enable-depth-of-field) Q: Can I change the material settings in XVerse/XScene-UEPlugin to enable depth of field?

**A:** While it’s theoretically possible to change the material from translucent to masked in the Niagara component, users have reported that Unreal Engine crashes when attempting this with the XScene-UEPlugin. The material settings may be locked or cause instability with this particular plugin. [discord discussion](https://discord.com/channels/1288765343552110637/1422034485934821497)

---

### [​](#q-does-postshot-still-allow-exporting-to-ply-format-in-the-free-version) Q: Does Postshot still allow exporting to PLY format in the free version?

**A:** No, the Postshot plugin no longer allows exporting as PLY if you don’t have a paid subscription. This is a limitation of the free version. [discord discussion](https://discord.com/channels/1288765343552110637/1422034485934821497)

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/prompt-guides/multi-image-prompt

# [​](#creating-worlds-with-multiple-images-with-direction-control) Creating Worlds with Multiple Images with Direction Control

In the  2D input mode of omnibox, drag in or upload up to 4 images.
Click on the text overlay on image thumbnails to change its direction, and choose one from “Front”, “Back”, “Left”, “Right”.
For this mode, images without overlap allow the marble models to creatively fill in the spaces between views.
When you are done specifying the direction of each image, click on  Create to generate the world.
For image file specifications, see [Prompt Guidelines →](/marble/create/prompt-guides)

* Direction Control is great for connecting different environments creatively.

# [​](#creating-worlds-with-multiple-images-with-auto-layout) Creating Worlds with Multiple Images with Auto Layout

In the  2D input mode of omnibox, drag in or upload up to 8 images.
Toggle “Auto Layout” switch to on so the world model automatically determines the relative positioning of these images.
In this mode, all uploaded images need to share the same aspect ratio and resolution, and should be images from the same space.
Currently images captured in close proximity of each other but covering different viewing directions, and with some overlap between images, work the best.
Click on  Create to generate the world.

* Auto Layout is great for quick reconstruction of existing spaces.

## [​](#troubleshooting-multi-image-issues) Troubleshooting Multi-Image Issues

### [​](#”auto-layout-not-working-properly”) ”Auto Layout not working properly”

* **Verify Aspect Ratios**: Ensure all images have exactly the same width-to-height ratio
* **Check for Overlap**: Include visual elements that appear in multiple images
* **Improve Image Quality**: Use sharp, well-lit images with clear details
* **Check Lighting Consistency**: Try to match lighting conditions and color temperatures
* **Use Images from Same Location**: Confirm all images are truly of the same space

Multi-image prompting allows you to build more complex, interesting worlds than single images alone.
The key is thoughtful planning of how your images relate spatially and visually to create cohesive, explorable environments.

---

## 🔗 Fonte: https://docs.worldlabs.ai/guides/export-options/houdini

404

# Page Not Found

We couldn't find the page. Maybe you were looking for one of these pages below?

[Exporting to Houdini](/marble/export/gaussian-splat/houdini#)[Exporting to Blender](/marble/export/gaussian-splat/blender#exporting-to-blender)[Exporting to Dev Frameworks](/marble/export/gaussian-splat/spark#)

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/export/gaussian-splat/unity

[](https://mintcdn.com/worldlabs/MLFIZQFuNhLp0_rH/media/marble-export-unity.mp4?fit=max&auto=format&n=MLFIZQFuNhLp0_rH&q=85&s=2bdc9ac35a56a7e3b6bc929c8af3ad17)
The free [**aras-p plugin**](https://github.com/aras-p/UnityGaussianSplatting) works well on Unity 6.1! Users have also reported positive results with this plugin. However, note that users have also reported draw-order issues in bringing multiple splat components in. So if you want to use multiple marble worlds in the same level, you may need to combine them into a single component beforehand.
If you have had positive or negative experiences with this plugin, we appreciate your feedback and will be updating this page as we go.


Community FAQ

### [​](#q-i’m-getting-an-“index-out-of-range”-error-when-trying-to-import-500k-splats-in-unity-the-2m-splats-work-fine-but-the-low-res-ones-don’t-load) Q: I’m getting an “Index out of range” error when trying to import 500k splats in Unity. The 2M splats work fine, but the low-res ones don’t load.

**A:** This is a known issue with the 500k spz files. As a workaround, convert the 500k spz file to a ply file using the converter at <https://spz-to-ply.netlify.app/>. The converted 500k ply file should import into Unity without issues. [discord discussion](https://discord.com/channels/1288765343552110637/1421913319538954472)

---

### [​](#q-how-can-i-convert-a-splat-into-a-working-3d-mesh-inside-unity-so-i-can-interact-with-it-and-try-new-things) Q: How can I convert a splat into a working 3D mesh inside Unity so I can interact with it and try new things?

**A:** There’s nothing inside Unity that supports converting splats to meshes. The only plugin we’re aware of that supports this is the Houdini GSOPs plugin. We have collider meshes and high quality mesh baking natively in Marble though! [discord discussion](https://discord.com/channels/1288765343552110637/1421913319538954472)

---

### [​](#q-my-splat-renders-fine-in-unity’s-game-view-but-when-i-export-to-quest-3-vr-i-get-a-completely-black-screen-what’s-wrong) Q: My splat renders fine in Unity’s Game view, but when I export to Quest 3 VR, I get a completely black screen. What’s wrong?

**A:** Enable HDR on your URP asset. This simple setting fix resolves the black screen issue in VR builds. Make sure HDR is enabled in your Universal Render Pipeline asset settings. [discord discussion](https://discord.com/channels/1288765343552110637/1421913319538954472)

---

### [​](#q-what-unity-version-should-i-use-for-vr-projects-with-splats) Q: What Unity version should I use for VR projects with splats?

**A:** Use Unity 6.0 (specifically 6000.0.23f1 or similar). The aras-p plugin does not work for VR on Unity 6.3. After downgrading to 6.0, make sure you have all the XR packages installed and check your graphics API settings. [discord discussion](https://discord.com/channels/1288765343552110637/1421913319538954472)

---

### [​](#q-what-are-the-recommended-settings-for-getting-splats-working-in-vr-on-quest-3) Q: What are the recommended settings for getting splats working in VR on Quest 3?

**A:** Here’s the recommended setup:

* **Unity Version:** 6.0 (6000.0.23f1 or similar)
* **Plugin:** aras-p UnityGaussianSplatting package
* **Render Pipeline:** URP (Universal Render Pipeline) with HDR enabled
* **Graphics API:** Vulkan
* **Rendering Mode:** Multi-view (not Single Pass Instanced - SPI causes black screens when the headset is active)
* **XR Packages:** Make sure all XR packages are installed

Both URP and BiRP (Built-in Render Pipeline) work, but URP is recommended. The visual quality looks the same between them. [discord discussion](https://discord.com/channels/1288765343552110637/1421913319538954472)

---

### [​](#q-i’m-getting-a-“ply-vertex-size-mismatch-expected-252-but-file-has-68”-error-with-the-ninjamode-gaussian-splat-vr-plugin-the-same-file-works-fine-with-the-aras-plugin) Q: I’m getting a “PLY vertex size mismatch, expected 252 but file has 68” error with the ninjamode Gaussian splat VR plugin. The same file works fine with the aras plugin.

**A:** Unfortunately, we haven’t tested the ninjamode plugin ourselves and can’t advise on it. The aras-p plugin is the recommended solution for Unity splat imports. We’ve put the ninjamode plugin on our list to try out in the future. [discord discussion](https://discord.com/channels/1288765343552110637/1421913319538954472)

---

### [​](#q-i-can’t-get-multi-pass-rendering-to-work-in-vr-it-automatically-switches-back-to-single-pass-when-i-open-it-in-vr) Q: I can’t get Multi-pass rendering to work in VR - it automatically switches back to Single-pass when I open it in VR.

**A:** This is expected behavior. Multi-view rendering works, but Single Pass Instanced (SPI) causes black screens when the headset is active. Stick with Multi-view rendering for VR builds. [discord discussion](https://discord.com/channels/1288765343552110637/1421913319538954472)

---

### [​](#q-what’s-the-performance-like-with-splats-on-quest-3) Q: What’s the performance like with splats on Quest 3?

**A:** Based on testing:

* **2M splat files:** Cause Quest 3 builds to crash when opening. Not recommended for standalone VR.
* **500k splat files:** Work better for VR, with better small details than 2M files in some cases. Performance is around 12fps in Unity, compared to 19fps in PlayCanvas (via Oculus browser). The 500k files are more suitable for standalone VR, while 2M files may only be viable for desktop VR. [discord discussion](https://discord.com/channels/1288765343552110637/1421913319538954472)

---

### [​](#q-i-need-to-place-assets-inside-my-marble-environment-but-they’re-falling-through-the-floor-even-though-i-have-a-mesh-collider-component-on-the-glb-any-tips) Q: I need to place assets inside my Marble environment, but they’re falling through the floor even though I have a mesh collider component on the GLB. Any tips?

**A:** This question was raised but not fully resolved in the discussion. The GLB mesh collider may need additional configuration. We’re planning to support coarse nav meshes and collider meshes natively in Marble soon, which should help with physics interactions. [discord discussion](https://discord.com/channels/1288765343552110637/1421913319538954472)

---

### [​](#q-which-splat-export-format-should-i-use-for-unity) Q: Which splat export format should I use for Unity?

**A:** Marble offers three export options:

* **2M ply** - Full resolution PLY format
* **2M spz** - Full resolution SPZ format
* **500K spz** - Lower resolution SPZ format

For Unity, the 2M spz files work out of the box. The 500k spz files have a known issue and need to be converted to ply format using <https://spz-to-ply.netlify.app/> before importing. [discord discussion](https://discord.com/channels/1288765343552110637/1421913319538954472)

---

### [​](#q-the-aras-plugin-works-in-the-sample-project-but-when-i-try-to-use-it-in-an-empty-project-the-ply-file-doesn’t-show-up-at-all) Q: The aras plugin works in the sample project, but when I try to use it in an empty project, the .ply file doesn’t show up at all.

**A:** Make sure you have all the required XR packages installed and that your graphics API is set correctly (Vulkan for VR). Also ensure HDR is enabled on your URP asset. Try recreating the setup from the aras-p sample project to ensure all dependencies are properly configured. [discord discussion](https://discord.com/channels/1288765343552110637/1421913319538954472)

---

## 🔗 Fonte: https://docs.worldlabs.ai/index

Marble is the first product from World Labs and is powered by our multimodal world models that can reconstruct, generate, and simulate 3D worlds. Marble lets anyone create high-fidelity, persistent 3D worlds from a single text prompt, single or multiple image, video, and coarse 3D structures.
This guide provides an overview of the Marble interface and the library of guides, tutorials, and templates for creating a world. Our goal is to help you jumpstart the world creation process so that you can publish and share your worlds with the world.

## [​](#navigating-marble) Navigating Marble

Marble’s interface is organized into several main sections to streamline your world creation workflow:

* **Gallery** - Browse and explore worlds created by the community, discover inspiration, and access your own created worlds
* **Create** - The main workspace for generating new 3D worlds using various input methods like text, images, videos, or 3D structures
* **Studio** - Advanced tools for editing, composing multiple worlds together, and creating cinematic recordings of your environments

## [​](#creating-a-world) Creating a World

Marble offers multiple ways to create 3D worlds, each tailored to different creative workflows and input types:

### [​](#preset) Preset

Browse and select curated preset examples to quickly generate worlds based on popular themes and styles, or  roll for marbles to select a random one.

### [​](#text-prompt) Text Prompt

Create worlds from natural language descriptions. Simply describe your vision and let Marble’s AI generate a complete 3D environment.

### [​](#single-image) Single Image

Transform any photograph or artwork into an immersive 3D world. Perfect for bringing 2D concepts into explorable 3D spaces. [Explore image prompt techniques →](/marble/create/prompt-guides/image-prompt)

### [​](#multiple-images) Multiple Images

Combine multiple images to specify more visual details in the world. You can specify directional positioning of each image (Front, Back, Left, Right) or use Auto Layout [Discover multi-image creation →](/marble/create/prompt-guides/multi-image-prompt)

### [​](#panorama) Panorama

Upload 360° panoramic images for maximum control over world layout and the most accurate spatial representation. [Learn panoramic world creation →](/marble/create/prompt-guides/pano-prompt)

### [​](#video) Video

Upload short video clips (under 100MB) to provide rich spatial information. Ideal for capturing 360° rotational views of spaces. [Master video-based world creation →](/marble/create/prompt-guides/video-prompt)

### [​](#3d-structure-“chisel”) 3D Structure (“Chisel”)

Use Marble’s built-in 3D modeling tools to block out geometric layouts and architectural structures as the foundation for detailed world generation. [Get started with Chisel →](/marble/create/chisel-tools/chisel-basics)

### [​](#reuse-prompt) Reuse Prompt

Quickly iterate on existing worlds by reusing successful prompts and modifying them for new variations.

## [​](#editing-a-world) Editing a World

Enhance and modify your created worlds using Marble’s powerful editing capabilities:

### [​](#pano-edit) Pano Edit

Edit your worlds through their panoramic representation. Select specific areas and describe changes using natural language prompts to make targeted modifications while preserving the overall environment. [Learn pano editing techniques →](/marble/edit/pano-edit)

### [​](#click-and-expand) Click and Expand

Grow your worlds beyond their original boundaries by clicking on unexplored areas and generating seamless extensions that naturally connect to existing content. [Master world expansion →](/marble/edit/click-and-expand)

### [​](#variation) Variation

Generate alternative versions of your worlds while maintaining core elements and style, perfect for exploring different possibilities from the same starting point. [Explore variation techniques →](/marble/edit/variation)

## [​](#studio-tools) Studio Tools

Take your world creation to the next level with advanced studio capabilities:

### [​](#compose) Compose

Connect and arrange multiple existing worlds into larger, seamless environments. Perfect for creating game maps, architectural complexes, or expansive connected experiences. [Learn world composition →](/marble/create/studio-tools/compose)

### [​](#record) Record

Create cinematic camera animations and record smooth flythrough videos of your worlds. Ideal for showcasing environments, creating trailers, or producing professional presentations. [Master animation recording →](/marble/create/studio-tools/record)

## [​](#exporting-a-world) Exporting a World

Share and use your created worlds across different platforms and applications:

### [​](#download-options) Download Options

Access various export formats depending on your intended use:

* **Web Sharing** - Copy shareable links for browser-based viewing and exploration
* **VR Experience** - Generate VR-compatible links for immersive virtual reality viewing
* **Development Assets** - Export 3D models and textures for use in game engines and development tools
* **DCC Integration** - Download files compatible with digital content creation software like Blender, Maya, and 3ds Max
* **Mesh Export** - Export clean 3D geometry for 3D printing, CAD software, or further modeling work

[Explore all export options →](/marble/export)

## [​](#platform-compatibility) Platform Compatibility

Marble is available on the web for both desktop and mobile. Some features are not yet supported on mobile (e.g., advanced creation flow with editing tools, creating from 3D structures, pano viewing), so we recommend using Marble on desktop for the full experience.

## [​](#generation-times) Generation Times

We’re constantly working to make it faster to generate worlds in Marble. Current estimated generation times:

* **Create pano from text, image, or 3D structure**: ~30 sec
* **Create pano from multi-image or video**: ~2 min
* **Create draft (from any input)**: ~20 sec
* **Create world (from any input)**: ~5 min
* **Expand world**: ~5 min
* **Edit pano**: ~20 sec
* **Generate high-quality mesh**: ~1 hr

## [​](#getting-help) Getting Help

### [​](#frequently-asked-questions) Frequently Asked Questions

Find answers to common questions about credits, file formats, sharing, VR access, and more. [Browse the FAQ →](/marble/support/faq)

### [​](#billing-and-support) Billing and Support

Learn about account management, billing information, and how to get additional support. [Visit billing and support →](/marble/support/account-billing)
Ready to start creating? Head to the [Create](/marble/create/prompt-guides) section to begin your first world, or explore the [Gallery](https://marble.worldlabs.ai) to see what’s possible with Marble.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/edit/variation

In Marble, you can **upload an image** to generate a 3D world. Once the world is created, you can modify the background by adjusting the **seed** for randomized variation, or by editing the **World Guide** for more precise control.

### [​](#1-change-the-seed) 1. **Change the Seed**

* Go to **Settings** in the bottom-left corner.
* Adjust the **Seed** value.
* Each new seed introduces **randomized background variations.**
* Example: changing the seed might transform a wall into a hallway or shift lighting.

👉 ***Try it: change the seed, hit Generate, and see what new background variation appears.***

### [​](#2-edit-the-world-guide-for-more-control) 2. **Edit the World Guide for More Control**

If you want more **precise control** over what appears in the background, edit the **World Guide** directly.

* This lets you refine elements beyond random seed changes.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/export

## [​](#format) Format

We currently support **gaussian splats exports** for all our content.
You can find the file specs and sample files for different options in the
[Export File Specs](/guides/export-options/options#splats).

The lower-resolution files have been optimized to be as perceptually similar as possible to the higher-resolution files. For those of you working with applications where lighter compute is important, we encourage you to give this a try! You may convert these to .ply files [here](https://spz-to-ply.netlify.app) if needed.

## [​](#integration) Integration

The [Radiance Fields](https://radiancefields.com/3d-gaussian-splatting-engine-support) website provides a comprehensive overview of platforms and plugins supporting splat integration. Here is a non-exhaustive subset of tools and platforms that we’ve either tested ourselves or received positive feedback from our user community about.
Click on one of these sub-categories to get started!

[## Spark

*Build custom applications using the spark.js framework for three.js developers.*  
Provides the highest degree of control and customization for web-based applications. Perfect for creating VR experiences, interactive games, and custom visualization tools.](/guides/export-options/spark)

## Professional Software

*Great for professional studios or creators using well-known tools like Unreal Engine, Unity, Houdini, or Blender.*These integrate well with offline production pipelines in established 3D software ecosystems. They allow teams to fit Gaussian Splat workflows into existing VFX, animation, or game development pipelines without needing to build tooling from scratch.**[Unreal Engine](/guides/export-options/unreal)**,
**[Unity](/guides/export-options/unity)**,
**[Blender](/guides/export-options/blender)**,
**[Houdini](/guides/export-options/houdini)**

## Web Platforms (Coming Soon!)

*Great for artists or teams prioritizing one-stop solutions and fast iteration over deep customization.*  
These focus on ease of sharing and distribution, often requiring minimal setup. Perfect for quickly showcasing work or creating interactive experiences that can be accessed directly in a browser.

We greatly appreciate the contributions and feedback from our user community on these so far— if you have insights or experiences with other export options, please share them with us on Discord and we will update these resources as we go!

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/edit/pano-edit

# [​](#pano-edit-modifying-worlds-through-panoramic-views) Pano Edit: Modifying Worlds Through Panoramic Views

Use Pano Edit to modify existing worlds by editing their 360° panoramic representation. This powerful tool lets you make targeted changes to your environments by describing edits in natural language and applying them to specific areas.

## [​](#getting-started-with-pano-edit) Getting Started with Pano Edit

The Pano Edit interface provides intuitive tools for world modification:

* **360° Panorama View**: The main viewport showing your world as a panoramic image
* **Edit Prompt Input**: Text field to describe your desired changes
* **Selection Tools**: Add images and select edit areas for targeted modifications
* **Project Panel**: Track your editing progress and manage versions
* **Apply Controls**: Preview and apply your edits to create new world versions

## [​](#how-to-edit-specific-areas-of-your-world) How to Edit Specific Areas of Your World

Make targeted changes to particular regions:

1. **Click Select Edit Area**: Use the **Select edit area** button to define your target region
2. **Define the Area**: Click and drag to outline the specific area you want to modify
3. **Describe Your Edit**: In the text prompt, describe how you want to change this area (e.g., “add snow-covered trees”)
4. **Apply Edit**: Click **Apply edit** to generate the modified version
5. **Review Changes**: The system creates a new panorama with your modifications applied

## [​](#how-to-add-reference-images) How to Add Reference Images

Use additional images to guide your edits:

1. **Click Add Images**: Select **Add images** to upload reference material
2. **Choose Your Images**: Upload photos that show the style or elements you want to add
3. **Position References**: The images help guide the AI’s understanding of your desired changes
4. **Combine with Text**: Use both images and text prompts for more precise control

## [​](#how-to-navigate-the-panorama) How to Navigate the Panorama

Move around your 360° world view:

1. **Click and Drag**: Use mouse controls to rotate and explore the panoramic view
2. **Use Navigation**: The “360° Panorama View” indicator shows you can look in all directions
3. **Find Your Target**: Navigate to the area you want to edit before selecting it
4. **Center Your View**: Position the area you want to change in the center for easier selection

## [​](#how-to-preview-and-apply-changes) How to Preview and Apply Changes

Review your edits before finalizing:

1. **Preview Draft**: Use **Preview Draft** to see your changes without committing
2. **Review the Edit**: Check how your modifications look in the context of the full world
3. **Make Adjustments**: If needed, refine your prompt or selection area
4. **Create World**: Click **Create World** to generate the final modified version
5. **Enable Public Mode**: Toggle on to share your edited world with the community

## [​](#how-to-manage-your-edit-workflow) How to Manage Your Edit Workflow

Track your editing progress effectively:

1. **Monitor Stages**: The right panel shows your workflow from Image Input → Pano (generated) → Draft → World
2. **Save Versions**: Each edit creates a new version while preserving the original
3. **Iterate Safely**: Make multiple edits without losing previous versions
4. **Track Progress**: See which stage of the editing process you’re currently in

## [​](#advanced-editing-techniques) Advanced Editing Techniques

### [​](#descriptive-edit-prompts) Descriptive Edit Prompts

* **Be Specific**: “Replace the wooden fence with a stone wall covered in ivy”
* **Include Style**: “Add Victorian-era street lamps with warm yellow lighting”
* **Mention Materials**: “Change the pavement to cobblestones with moss between cracks”
* **Describe Atmosphere**: “Make the sky stormy with dark clouds and lightning”

### [​](#combining-multiple-edits) Combining Multiple Edits

* **Sequential Editing**: Apply one edit, then use the result for the next modification
* **Layered Changes**: Build up complex modifications through multiple passes
* **Targeted Regions**: Focus each edit on specific areas for precise control

## [​](#common-editing-scenarios) Common Editing Scenarios

### [​](#weather-and-atmosphere-changes) Weather and Atmosphere Changes

* Convert sunny scenes to rainy, snowy, or foggy conditions
* Adjust lighting from day to night or change seasons
* Add atmospheric effects like mist or storm clouds

### [​](#architectural-modifications) Architectural Modifications

* Add or remove buildings, structures, or architectural elements
* Change building styles, materials, or colors
* Modify landscaping, paths, or outdoor furniture

### [​](#environmental-updates) Environmental Updates

* Change vegetation types or add/remove plants
* Modify terrain features like hills, water, or rocks
* Add or remove objects like vehicles, signs, or decorations

## [​](#faq) FAQ

### [​](#how-precise-can-my-area-selections-be) How precise can my area selections be?

The **Select edit area** tool allows you to draw custom shapes around specific regions. You can be quite precise, but remember that the AI may affect surrounding areas slightly to ensure natural blending.

### [​](#can-i-undo-edits-if-i-don’t-like-the-results) Can I undo edits if I don’t like the results?

Each edit creates a new version while preserving the original. You can always return to previous versions or start new edits from any saved stage in your workflow.

### [​](#what-makes-a-good-edit-prompt) What makes a good edit prompt?

Good prompts are specific, descriptive, and focused. Instead of “make it better,” try “add colorful street art murals on the brick walls” or “replace the grass with a Japanese zen garden.”

### [​](#can-i-edit-multiple-areas-at-once) Can I edit multiple areas at once?

Currently, you select and edit one area at a time. For multiple changes, apply edits sequentially, using each result as the base for the next modification.

### [​](#how-do-reference-images-help) How do reference images help?

**Add images** provides visual examples of what you want to achieve. If you want to add specific architectural details, furniture, or artistic styles, reference images guide the AI more effectively than text alone.

### [​](#what’s-the-difference-between-preview-draft-and-create-world) What’s the difference between Preview Draft and Create World?

**Preview Draft** shows you the edit without finalizing it, letting you review and adjust. **Create World** commits the changes and creates the final, navigable 3D world.

### [​](#how-does-public-mode-work-in-editing) How does Public Mode work in editing?

When enabled, **Public mode** makes your edited world visible in the community gallery. This is useful for sharing your creative modifications with other users.

### [​](#can-i-edit-worlds-created-by-other-users) Can I edit worlds created by other users?

You can only edit worlds in your own library. However, if a world is shared publicly, you might be able to create your own version and then edit that copy.

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/create/prompt-guides/index

## [​](#text-prompts) Text prompts

* Up to 2,000 characters
* Describe a location, such as “A warm, rustic cabin living room with a glowing stone fireplace, cozy leather sofa, wooden beams, and large windows overlooking a snowy forest.”

## [​](#images) Images

* Recommended resolution: 1024 on the long side
* Recommended aspect ratio: 16:9, 9:16, or anything in between
* Max file size: 20 MB
* Supported formats: png (recommended), jpg, webp
* See [Image Prompt Guide](./image-prompt) and [Multi-image Prompt Guide](./multi-image-prompt).

## [​](#panoramas) Panoramas

* full 360 degree equirectangular projection, in 2:1 aspect ratio.
* Recommended resolution: 2560 pixels wide
* See [Panorama Prompt Guide](./pano-prompt).

## [​](#video) Video

* Max file size: 100 MB
* Max duration: 30 seconds
* Supported formats: mp4, mov, webm
* See [Video Prompt Guide](./video-prompt).

## [​](#3d-structure-uploads-“chisel”-import) 3D structure uploads (“Chisel” Import)

* Max file size: 100 MB
* Supported formats: glb, fbx

---

## 🔗 Fonte: https://docs.worldlabs.ai/marble/edit/click-and-expand

404

# Page Not Found

We couldn't find the page. Maybe you were looking for one of these pages below?

[Expand](/marble/create/prompt-guides/expand#expand)[Welcome to Marble](/index#welcome-to-marble)[Advanced create](/marble/create/prompt-guides/advanced-create#advanced-create)