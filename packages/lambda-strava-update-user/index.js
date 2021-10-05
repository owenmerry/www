const middy = require('middy')
const { HttpError } = require('http-errors')
const {
  jsonBodyParser,
  validator,
  httpHeaderNormalizer,
  cors
} = require('middy/middlewares')
const {
  getOne,
  updateOne
} = require('./db')

async function updateUser (event) {
  if (event.header.Authorization !== process.env.AUTH_TOKEN) {
    return {
      statusCode: 403
    }
  }

  const item = await getOne(process.env.AWS_STRAVA_OAUTH_TABLE, {
    id: `${event.path.id}`
  })

  if (!item) {
    return {
      statusCode: 404
    }
  }

  await updateOne(process.env.AWS_STRAVA_OAUTH_TABLE, {
    id: `${event.path.id}`
  }, {
    UpdateExpression: 'SET #A=:a, #R=:r, #E=:e, #I=:i',
    ExpressionAttributeNames: {
      '#A': 'access_token',
      '#R': 'refresh_token',
      '#E': 'expires_at',
      '#I': 'expires_in'
    },
    ExpressionAttributeValues: {
      ':a': {
        S: event.body.access_token
      },
      ':r': {
        S: event.body.refresh_token
      },
      ':e': {
        S: `${event.body.expires_at}`
      },
      ':i': {
        S: `${event.body.expires_in}`
      }
    },
    ReturnValues: 'UPDATED_NEW'
  })
}

const inputSchema = {
  type: 'object',
  properties: {
    headers: {
      type: 'object',
      properties: {
        Authorization: { type: 'string', pattern: '.+' }
      },
      required: ['Authorization']
    },
    path: {
      type: 'object',
      properties: {
        id: { type: 'number', pattern: '.+' }
      },
      required: ['id']
    },
    body: {
      type: 'object',
      properties: {
        access_token: { type: 'string', pattern: '.+' },
        refresh_token: { type: 'string', pattern: '.+' },
        expires_at: { type: 'number', pattern: '.+' },
        expires_in: { type: 'number', pattern: '.+' }
      },
      required: ['access_token', 'refresh_token', 'expires_at', 'expires_in']
    }
  }
}

const errorHandler = () => ({
  onError: (handler, next) => {
    if (handler.error instanceof HttpError) {
      if (handler.error.message.includes('failed validation')) {
        const details = handler.error.details[0]

        handler.response = {
          statusCode: 422,
          body: JSON.stringify({
            field: details.dataPath.replace('.body.', '')
          })
        }

        next()
      } else {
        next(handler.error)
      }
    } else {
      next(handler.error)
    }
  }
})

module.exports = {
  handler: middy(updateUser)
    .use(httpHeaderNormalizer())
    .use(jsonBodyParser())
    .use(validator({ inputSchema }))
    .use(errorHandler())
    .use(cors({
      origin: process.env.NODE_ENV !== 'development' ? 'https://peckham.cc' : '*'
    }))
}
