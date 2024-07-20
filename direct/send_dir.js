const ampqlib=require('amqplib')

const exchangeName="logs1"
const msg="hello this is fanout// brodcast"

const sendMsg=async()=>{
    const connection=await ampqlib.connect('amqp://localhost')
    const channel=await connection.createChannel()
    //fanout,difference is instead of sending and making a queue,it makes exchange,in consumer program we need to bind a que with this exchange.then that queu will  get the msg
    await channel.assertExchange(exchangeName,'direct',{durable:false})
  channel.publish(exchangeName,'key',Buffer.from(msg))
    console.log('sent:',msg)
    setTimeout(()=>{
        connection.close()
        process.exit(0)
    },500)
}
sendMsg();