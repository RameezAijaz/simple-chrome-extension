import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import {getTodoList, setTodoList} from './DataService';

function CrossButton(props){
    return(<Button type="button" className="close" aria-label="Close" onClick={()=>props.removeItem(props.itemKey)}><span aria-hidden="true">&times;</span></Button>)
}
class TodoList extends React.Component {
    constructor(props){
        super(props);
        this.state = {todoListItems:[]};
    }
    async getTodoList(){
        const items = await getTodoList()||[];
        this.setState({todoListItems: items});
    }
    addItem(){
        if(!this.state.item)
            return;
        this.setState((prevState)=>{

            let items = prevState.todoListItems;
            items.push(prevState.item);
            setTodoList(items);
            return {todoListItems: items, item:''};
        });
    }

    componentDidMount(){
        this.getTodoList.call(this);
    }
    removeItem(key){
        this.setState((prevState)=>{

            let items = prevState.todoListItems;
            items.splice(key, 1);
            setTodoList(items);
            return {todoListItems: items}

        });
    }
    getListItems(data){
        if(!data || data.length === 0)
            return <p>Todo list is empty.</p>;

        return(<ListGroup className="todo-list">
            {data.map((l,i) => <ListGroup.Item key={i}>{`${i+1}) ${l}`}<CrossButton itemKey={i} removeItem={this.removeItem.bind(this)}/></ListGroup.Item>)}
                </ListGroup>);
    }
    render(){
        return(
            <div className="card todo-list-container">
                <div className="card-header"><h3 className="card-title">Todo List</h3></div>
                <div className="card-body">
                    {this.getListItems(this.state.todoListItems)}
                </div>

                <div className="card-footer">
                    <InputGroup className="mb-3">
                        <FormControl
                            value={this.state.item}
                            placeholder="Task Name"
                            aria-label="Task Name"
                            aria-describedby="basic-addon2"
                            onChange={e=>this.setState({item:e.target.value})}
                        />
                        <InputGroup.Append>
                            <Button disabled={!this.state.item} variant="primary" onClick={this.addItem.bind(this)}>Add</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
            </div>)
    }

}

export default TodoList;
