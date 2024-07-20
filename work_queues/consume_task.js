const ampqlib=require('amqplib')

const queueName="task"



const recieveMsg=async()=>{
    const connection=await ampqlib.connect('amqp://localhost')
    const channel=await connection.createChannel()
    await channel.assertQueue(queueName,{durable:true})//for safety if the recieve runs first then there need a qnamed hello
    channel.prefetch(1)//for checking the service is free ,if free send the message there rather than round robin
    console.log(`waiting msg from queue ${queueName}:`)
    channel.consume(queueName,msg=>{
        const secs=msg.content.toString().split('.').length-1;
                console.log("Recieved msg: ",msg.content.toString())
                setTimeout(()=>{
                    console.log("Done resizing image")
                    channel.ack(msg)//manually aknowledge after the operation done,then the task will be delete in rabbitmq queue
                },secs*1000)
    },{noAck:false})//noAack true means sending back aknowledgment.It made false beacause,if service fails then also it will send true if  it made true,so we need to send true only when job done
   
}
recieveMsg();