const express = require("express")
const mongoose = require("mongoose")
const nodemailer = require("nodemailer")
const cors = require("cors")
const app = express()
// to use the cors on express app
app.use(cors())
// middleware
app.use(express.json())

// db connection 
mongoose.connect('mongodb+srv://forsites1702:97pcSH90emJ2vsRy@cluster0.hroglbj.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0').then(function () {
    console.log("Db connected sucessfully")
})
    .catch(
        function () {
            console.log("Can't connect db")
        }
    )

// creating model - collection

const credencial = mongoose.model("credential", {}, "bulkmail"
)
credencial.find().then(
    function (data) {
        console.log("data from db : ", data[0].toJSON())
        // transporter - mail send area
        const transporter = nodemailer.createTransport(
            {
                service: "gmail",
                auth: {
                    user: data[0].toJSON().user,
                    pass: data[0].toJSON().pass
                },
            }
        );

        // api
        app.post('/sendmail', function (req, res) {
            console.log("msg from user : " + req.body.msg)
            console.log("Sub msg from user : " + req.body.sub)
            var sub = req.body.sub
            var msg = req.body.msg
            var emaillist = req.body.email
            console.log("emails from file : " + emaillist)

            new Promise(
                async function (resolve, reject) {
                    try {
                        for (var i = 0; i < emaillist.length; i++) {
                            // transporter creation to send mails from ,to,sub,text
                            await transporter.sendMail(
                                {
                                    from: "umasubramanian2002@gmail.com",
                                    to: emaillist[i],
                                    subject: sub,
                                    text: msg
                                },
                                function (err, info) {
                                    if (err) {
                                        console.log(err)
                                        res.send(true)
                                    }
                                    else {
                                        console.log(info)
                                        res.send(false)
                                    }
                                }
                            )
                            console.log("Email sent to ", emaillist[i])
                        }
                        resolve("Sucess")
                    }

                    catch (error) {
                        console.log("Error on sending mail")
                        reject("Fail")
                    }

                }
            )

                .then(
                    function () {
                        res.send(true)
                    }
                )
                .catch(
                    function () {
                        console.log(false)
                    }
                )


        })
    }
)
    .catch(
        function () {
            console.log("can't get data from db")
        }
    )

// set port
app.listen(4000, function () {
    console.log("Running port 4000 ...")
})