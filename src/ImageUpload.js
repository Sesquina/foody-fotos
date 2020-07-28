import React, { useState } from 'react'
import { Button} from '@material-ui/core'
import { storage , db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const style = {
        color: 'red',
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px',
      }; 

    const handleUpload = () => {
            //access storage in firebase. get a reference
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed", //on state changed to give me a snapshot
            (snapshot) => {
                const progress = Math.round(  //progress bar function...
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => { //Error function...
                console.log(error);
                alert(error.message);
            },
            () => {
                storage //complete function..
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({ //post image inside db
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);

                    });
            }

        );
    }

    return (

    

        <div className='imageupload' >
            
            <progress className='imageupload__progress' value={progress} max='100' />
            <input type='text' placeholder='Enter a caption..' onChange={event => setCaption(event.target.value)} value={caption} />
            <input type='file' onChange={handleChange} />
            <Button style={style} onClick={handleUpload}>Upload</Button>
            
        </div>
    )
}

export default ImageUpload;