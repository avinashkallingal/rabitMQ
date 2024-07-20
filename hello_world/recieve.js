const ampqlib=require('amqplib')

const queueName="hello"
const queueName2="welcome"


const recieveMsg=async()=>{
    const connection=await ampqlib.connect('amqp://localhost')
    const channel=await connection.createChannel()
    await channel.assertQueue(queueName,{durable:false})//for safety if the recieve runs first then there need a qnamed hello
    await channel.assertQueue(queueName2,{durable:false})
    console.log(`waiting msg from queue ${queueName}:`)
    channel.consume(queueName,msg=>{
        console.log("Recieved msg: ",msg.content.toString())
    },{noAck:true})//noAack true means sending back aknowledgment

    channel.consume(queueName2,msg=>{
        console.log("Recieved msg: ",msg.content.toString())
    },{noAck:true})
   
}
recieveMsg();