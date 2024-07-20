const ampqlib=require('amqplib')
const {v4:uuidvv4}=require('uuid')

const args=process.argv.slice(2)

if(args.length==0){
    console.log("error:rpc_client.js num")
    process.exit(1)
}

const num=parseInt(args[0])
const uuid=uuidvv4()

const sendMsg=async()=>{
    const connection=await ampqlib.connect('amqp://localhost')
    const channel=await connection.createChannel()
    const q=await channel.assertQueue('',{exclusive:true})
    console.log('requesting fib',num)

    channel.sendToQueue('rpc_queue',Buffer.from(num.toString()),{
        replyTo:q.queue,
        correlationId:uuid
    })

    channel.consume(q.queue,msg=>{
        if(msg.properties.correlationId==uuid){
            console.log("got ans",msg.content.toString())

            setTimeout(()=>{
                connection.close()
                process.exit(0)
            },500)

        }
      

    },{noAck:true})

    
    
}
sendMsg();