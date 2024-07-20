const ampqlib=require('amqplib')

const queueName="welcome"
const msg="hi avinash your are welcome"

const sendMsg=async()=>{
    const connection=await ampqlib.connect('amqp://localhost')
    const channel=await connection.createChannel()
    await channel.assertQueue(queueName,{durable:false})
    channel.sendToQueue(queueName,Buffer.from(msg))
    console.log('sent:',msg)
    setTimeout(()=>{
        connection.close()
        process.exit(0)
    },500)
}
sendMsg();