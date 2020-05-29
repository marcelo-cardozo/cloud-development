import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)


import { TodoItem as Todo } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getAllTodos(): Promise<Todo[]> {
    console.log('Getting all todos')

    const result = await this.docClient.scan({
      TableName: this.todosTable
    }).promise()

    const items = result.Items
    return items as Todo[]
  }

  async createTodo(todo: Todo) : Promise<Todo>{
    console.log('Creating todo')

    await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
    }).promise()

    return todo
  }

  async updateTodo(todoId: string, todo: TodoUpdate) : Promise<Todo>{
    console.log('Updating todo')

    const updatedTodo = await this.docClient.update({
        TableName: this.todosTable,
        Key:{
            todoId
        },
        UpdateExpression: 'SET #todoName = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames:{
          '#todoName': 'name'
          
        },
        ExpressionAttributeValues:{
            ':name': todo.name,
            ':dueDate': todo.dueDate,
            ':done': todo.done
        },
        ReturnValues: 'ALL_NEW'
    }).promise()
    
    return updatedTodo.Attributes as Todo
  }

  async deleteTodo(todoId: string): Promise<void> {
    
    await this.docClient.delete({
      TableName: this.todosTable,
      Key:{
        todoId
      }
    }).promise()


  }
  
}


function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    XAWS.config.update({
      region: 'us-east-1',
      accessKeyId: 'xxxx',
      secretAccessKey: 'xxxx'
    });
    
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: `http://localhost:${process.env.OFFLINE_PORT_DYNAMODB}`
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
