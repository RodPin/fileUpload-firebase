import React, { Component } from "react";
import firebase from "firebase";

class FileUpload extends Component {
  constructor() {
    super();
    this.state = { uploadValue: 0, picture: null };

    this.handleUpload = this.handleUpload.bind(this);
  }

  handleUpload(event) {
    //recuperar o file que estamos uploadando
    const file = event.target.files[0];
    //definir aonde vamos salvar a foto no firebase
    const storageRef = firebase
      .storage()
      .ref(`/fotosUsuarios/${firebase.auth().currentUser.email}`);
    //executar o armazenamento
    const task = storageRef.put(file);

    //definindo a porcentagem que esta no upload
    task.on(
      "state_changed",
      snapshot => {
        let percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({ uploadValue: percentage });
      },
      error => {
        console.log(error.message);
      },
      () => {
        this.setState({
          uploadValue: 100,
          picture: task.snapshot.downloadURL
        });
      }
    );
  }

  render() {
    return (
      <div>
        <progress value={this.state.uploadValue} max="100" />
        <br />
        <input type="file" onChange={this.handleUpload} />
        <br />
        <img width="300" src={this.state.picture} alt="" />
      </div>
    );
  }
}

export default FileUpload;
