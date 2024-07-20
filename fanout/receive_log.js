const ampqlib=require('amqplib')

const exchangeName="logs"


const recieveMsg=async()=>{
    const connection=await ampqlib.connect('amqp://localhost')
    const channel=await connection.createChannel()
    await channel.assertExchange(exchangeName,'fanout',{durable:false})//for safety if the recieve runs first then there need a qnamed hello
   const q=await channel.assertQueue('',{exclusive:true})
    console.log(`waiting msg from queue ${q.queue}:`)
    channel.bindQueue(q.queue,exchangeName,'')//here blank '' is for routing key.no routing key needed for fanout
    channel.consume(q.queue,msg=>{
        console.log("Recieved msg: ",msg.content.toString())
    },{noAck:true})//noAack true means sending back aknowledgment

   }
recieveMsg();