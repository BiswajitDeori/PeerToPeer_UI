let array=[]
self.addEventListener("message", event =>
{
    console.log(event.data)
    if(event.data === "download")
    {
        const blob = new Blob(array);
        self.postMessage(blob);
        array=[];
    }else{

        console.log("else" + event.data)
        array.push(event.data);
    }
}
)