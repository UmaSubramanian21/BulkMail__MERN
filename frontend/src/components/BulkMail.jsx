import * as XLXS from "xlsx"
import axios from "axios"
import { useState } from "react"

function BulkMail() {
    // to store the user entered message 
    const [msg, setMsg] = useState("")
    const [subMsg, setSubMsg] = useState("")
    // send button updates
    const [status, setStatus] = useState(false)

    // to store emails from xl file
    const [email, setEmail] = useState([])

    // total number of emails in the file 
    const [total, setTotal] = useState(0)

    function handleSub(evt) {
        setSubMsg(evt.target.value)
    }
    function handleMsg(evt) {
        setMsg(evt.target.value)
        // console.log(msg)
    }

    // function for send user msg to backend
    function send() {
        setStatus(true)
        axios.post(`http://localhost:4000/sendmail`, { msg: msg, sub: subMsg, email: email }).then(
            function (data) {

                setStatus(false)

                console.log(data)
            }
        )
            .catch(
                function () {
                    console.log("Not sent")
                }
            )
    }

    // handle file 
    function handleFile(evt) {

        // store the choosen file in variable file
        const file = evt.target.files[0]
        console.log(file)
        // let's Read 
        // read the file using FileReader method
        const reader = new FileReader()

        // to read the book from xl 
        // it gives the file data that is not readable coz it's binary type
        reader.onload = function (evt) {
            const data = evt.target.result
            console.log("binary data")
            // to convert / read a from non readable to readable
            // XLXS is a library ( from cdn ) for read a binary file
            const workbook = XLXS.read(data, { type: 'binary' })
            console.log(workbook)
            // excel may has many sheets we wann select the email sheet
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const emailList = XLXS.utils.sheet_to_json(worksheet, { header: 'A' })
            var total = emailList.length
            setTotal(total)

            var emails = emailList.map(function (item) {
                return item.A
            })
            setEmail(emails)

        }

        // default file is in binary so , 
        reader.readAsBinaryString(file)
        console.log(email)

    }


    return (
        <>
            <div className="bg-blue-950 text-white text-center p-5 font-bold text-2xl">Bulk Mail            </div>
            <div className="bg-blue-800 text-white text-center p-5 font-bold text-xl"> We can help your business with sending multiple emails at once</div>
            <div className="bg-blue-600 text-white text-center p-5 font-bold ">Drag and Drop</div>
            <div className="bg-blue-400 text-white text-center p-5 font-bold ">

                <textarea
                    onChange={handleSub}
                    className="w-[80%] rounded-md px-3 py-1 text-black outline-none" placeholder="Enter Subject here ..."></textarea>

                <textarea
                    onChange={handleMsg}

                    className="w-[80%] h-32 rounded-md px-3 py-1 text-black outline-none" placeholder="Enter the emails body here ... "></textarea>

                <input type="file"
                    id="file_input"
                    onChange={handleFile}
                    className="outline-none cursor-pointer 
                border-4 border-dashed py-2 px-4 border-white mt-5 mb-5"></input>
                <p>Total emails in the file : {total}</p>
                <button
                    onClick={send}
                    className="bg-blue-900 px-3 py-1 mt-5 mb-5 rounded-md">{status ? "Sending..." : "Send"}</button>
            </div>
            <div className="bg-blue-600 text-white text-center p-5 font-bold "></div>
            <div className="bg-blue-800 text-white text-center p-5 font-bold "></div>

        </>
    )
}

export default BulkMail