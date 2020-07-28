import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
// import foodylogo from "./foodylogo.png";


function getModalStyle() {
  const top = 50;
  const left = 50;

  


  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const style = {
  color: 'red',
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px',
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);


  useEffect(()=> {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);

      } else {
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }

  },[user, username]);

  useEffect(() => {  //this is where the code runs
    //everytime a new post is added, this code fires
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => { 
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data(),
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    
    setOpenSignIn(false);
  }



  return (
    <div className="app">
  
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
        <form className='app__signup' >
          <center>
            <img className='app__headerImage' src="https://fontmeme.com/permalink/200728/4ff891c995f785fd133f0e064ff67bb4.png" alt='Foody' />
          </center>
            <Input placeholder='username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />

            <Input placeholder='email' type='text' value={email} onChange={(e) => setEmail(e.target.value)} />

            <Input placeholder='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button onClick={signUp} >Sign Up</Button>
    
        </form>  
      
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
        <form className='app__signup' >
          <center>
            <img className='app__headerImage' src="https://fontmeme.com/permalink/200728/4ff891c995f785fd133f0e064ff67bb4.png" alt='Foody' />
          </center>

            <Input placeholder='email' type='text' value={email} onChange={(e) => setEmail(e.target.value)} />

            <Input placeholder='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button onClick={signIn} >Sign In</Button>
    
        </form>  
      
        </div>
      </Modal>


      <div className='app__header' >
        <img className='app__headerImage' src="https://fontmeme.com/permalink/200728/4ff891c995f785fd133f0e064ff67bb4.png" alt='Foody' />    
        {user ? (
          <Button type='submit' onClick={() => auth.signOut()}>LOGOUT</Button>
        ): (
          <div className='app__loginContainer'>
            <Button style={style} type='submit'  onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button style={style} type='submit'  onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      
      <div className='app__posts'>
        <div className='app__postsMain' >
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
     
      </div>
   
      {user?.displayName ? (
        console.log("this is user", user),
        <ImageUpload username={user.displayName} />
        ): (
        <h3 className='app__message'>Sorry you need to login to upload</h3>
      )}
    </div>


  )
}

export default App;