const ampqlib=require('amqplib')
const queueName="rpc_queue"

function fibonacci(n){
    if(n==0||n==1){
        return n
    }
    else{
    return fibonacci(n-1)+fibonacci(n-2)}
}


const processTask=async()=>{
    const connection=await ampqlib.connect('amqp://localhost')
    const channel=await connection.createChannel()
    await channel.assertQueue(queueName,{durable:true})//for safety if the recieve runs first then there need a qnamed hello
    channel.prefetch(1)//for checking the service is free ,if free send the message there rather than round robin
    console.log(`waiting rpc requests from ${queueName}:`)

    //consuming the msg from queue that created by client
    channel.consume(queueName,msg=>{
       const n=parseInt(msg.content.toString())
       console.log("fib",n)
       const fibNum=fibonacci(n)
       console.log("answer in server",fibNum)
        
       //sending the answer to the queue that mentioned in client with correlationId.making a new queue to reply the answer rather than same queue
       channel.sendToQueue(msg.properties.replyTo,Buffer.from(fibNum.toString()),{
        correlationId:msg.properties.correlationId
       })
       channel.ack(msg)

    },{noAck:false})//noAack true means sending back aknowledgment.It made false beacause,if service fails then also it will send true if  it made true,so we need to send true only when job done
   
}
processTask();