var Person = React.createClass({
    render: function () {
        return (
            <div className="person">
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={6} md={4}>
                        <h4>
                            {this.props.name}
                        </h4>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} md={8}>Address : {this.props.address}<br/>Contact : {this.props.contact}
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>


            </div>
        );
    }
});
var PersonList = React.createClass({
    render: function () {
        var personNodes = this.props.data.map(function (person, index) {
            return (
                <ReactBootstrap.ListGroupItem>
                    <Person name={person.name} address={person.address} contact={person.contact} key={index}>
                    </Person>
                </ReactBootstrap.ListGroupItem>
            );
        });
        return (
            <div className="PersonList">
                {personNodes}
            </div>
        );
    }
});


var PersonForm = React.createClass({
    handleSubmit: function (e) {
        e.preventDefault();
        var name = this.refs.name.getValue().trim();
        var contact = this.refs.contact.getValue().trim();
        var address = this.refs.address.getValue().trim();
        if (!contact || !name) {
            return;
        }
        this.props.onPersonSubmit({name: name, contact: contact, address: address});
        React.findDOMNode(this.refs.name).value = '';
        React.findDOMNode(this.refs.contact).value = '';
        React.findDOMNode(this.refs.address).value = '';
    },
    render: function () {
        return (
            <form className="personForm">
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={6} md={4}>
                        <label class="col-sm-4">Name </label>

                    </ReactBootstrap.Col>

                    <ReactBootstrap.Col xs={6} md={4}>
                        <ReactBootstrap.Input class="col-sm-4" type="text" ref="name"/>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={6} md={4}>
                        <label>Contact No. </label>
                    </ReactBootstrap.Col>

                    <ReactBootstrap.Col xs={6} md={4}>
                        <ReactBootstrap.Input type="text" ref="contact"/>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={6} md={4}>
                        <label>Address </label>
                    </ReactBootstrap.Col>

                    <ReactBootstrap.Col xs={6} md={4}>
                        <ReactBootstrap.Input type="text" ref="address"/>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>

            </form>
        );
    }
});

const Trigger = React.createClass({
    getInitialState: function () {
        return {show: false};
    },

    close: function () {
        this.setState({show: false});
    },

    open: function () {
        this.setState({show: true});
    },
    handleSubmit: function (e) {
        this.refs.form.handleSubmit(e);
        this.close();
    },
    handlePersonSubmit: function (person) {
      this.props.onPersonSubmit(person);

    },

    render: function () {
        //let close = e => this.setState({ show: false});

        return (
            <div className='modal-container'>
                <ReactBootstrap.Button
                    bsStyle='primary'
                    bsSize='large'
                    onClick={this.open}
                    >
                    Add Contact
                </ReactBootstrap.Button>

                <ReactBootstrap.Modal
                    show={this.state.show}
                    onHide={this.close}
                    container={this}
                    aria-labelledby='contained-modal-title'
                    >
                    <ReactBootstrap.Modal.Header closeButton>
                        <ReactBootstrap.Modal.Title id='contained-modal-title'>Add New
                            Contact</ReactBootstrap.Modal.Title>
                    </ReactBootstrap.Modal.Header>
                    <ReactBootstrap.Modal.Body>
                        <PersonForm ref="form" onPersonSubmit={this.handlePersonSubmit}/>
                    </ReactBootstrap.Modal.Body>
                    <ReactBootstrap.Modal.Footer>
                        <ReactBootstrap.Button onClick={this.close}>Close</ReactBootstrap.Button>
                        <ReactBootstrap.Button onClick={this.handleSubmit}>Submit</ReactBootstrap.Button>

                    </ReactBootstrap.Modal.Footer>
                </ReactBootstrap.Modal>
            </div>
        );
    }
});


var PersonBox = React.createClass({
    loadPersonsFromServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handlePersonSubmit: function (person) {
        var persons = this.state.data;
        persons.push(person);
        this.setState({data: persons}, function () {
            // `setState` accepts a callback. To avoid (improbable) race condition,
            // `we'll send the ajax request right after we optimistically set the new
            // `state.

            $.ajax({
                url: this.props.url,
                dataType: 'json',
                type: 'POST',
                data: person,
                success: function (data) {
                    this.setState({data: data});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });

        });
    },
    getInitialState: function () {
        return {data: []};
    },

    componentDidMount: function () {
        this.loadPersonsFromServer();
        setInterval(this.loadPersonsFromServer, this.props.pollInterval);
    },
    render: function () {
        return (

            <ReactBootstrap.Grid>

                <div className="personBox">
                    <ReactBootstrap.Row>

                        <ReactBootstrap.Col xs={6} md={4}>
                            <h1 >Address Book</h1>
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12} md={8}>
                            <Trigger url="persons.json" onPersonSubmit={this.handlePersonSubmit}/>
                        </ReactBootstrap.Col>
                    </ReactBootstrap.Row>
                    <ReactBootstrap.Row>

                        <ReactBootstrap.Col xs={12} md={6}>
                            <PersonList data={this.state.data}/>
                        </ReactBootstrap.Col>
                    </ReactBootstrap.Row>
                </div>

            </ReactBootstrap.Grid>

        );
    }
});

React.render(
    <PersonBox url="persons.json" pollInterval={2000}/>,
    document.getElementById('content')
);








