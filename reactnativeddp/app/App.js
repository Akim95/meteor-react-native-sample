// import react modules
import React, { Component } from 'react';
// import { View } from 'react-native';

// import react native meteor
import Meteor, { createContainer, MeteorListView } from 'react-native-meteor';

// import native-base
import { Container, Header, Title, Content, List, ListItem, Text, Input, Spinner } from 'native-base';

// connect to meteor websocket server
Meteor.connect('ws://localhost:3000/websocket');

class App extends Component {
  constructor(props) {
    super();

    // bind onHandleSubmit
    this.onHandleSubmit = this.onHandleSubmit.bind(this);

    // current text input state
    this.state = {
      text: ''
    };
  }

  // submit new task operation
  onHandleSubmit() {
    // meteor call
    Meteor.call('tasks.insert', this.state.text, function(err) { console.log(err); });

    // clear text input
    return this.setState({text: ''})
  }

  // render tasks list
  renderRow(task) {
    return (
      <List>
        <ListItem>
          <Text>{task.text}</Text>
        </ListItem>
      </List>
    );
  }

  // render view
  render() {

    // check subscription is ready?
    const tasksReady = this.props.tasksReady;

    return (
      <Container>
        <Header>
          <Title>Tasks List</Title>
        </Header>
      { !tasksReady ?
       <Content>
        <Spinner color="red" />
       </Content>
       :
       <Content>
        <List>
          <ListItem>
            <Input
              onSubmitEditing={this.onHandleSubmit}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              placeholder="Enter a new task"
            />
          </ListItem>
        </List>
            <MeteorListView
              collection="tasks"
              options={{sort: {createdAt: 1}}}
              renderRow={this.renderRow}
              enableEmptySections={true}
            />
          </Content>
      }
      </Container>
    );
  }
}

// create container
export default createContainer(params=>{

  // subscribe tasks collection
  const handle = Meteor.subscribe('tasks');

  // tasksReady props
  return {
    tasksReady: handle.ready(),
  };

}, App)
