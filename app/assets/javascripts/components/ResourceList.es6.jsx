class ResourceList extends React.Component {
  constructor() {
    super();
    this.state = {
      editResourceForm: false,
      resource: {},
      rlresources: [],
      anyErrors: false,
      addResourceForm: false
    }
    this.handleReturnClick = this.handleReturnClick.bind(this);
    this.handleAddNewResource = this.handleAddNewResource.bind(this);
    this.handleEditResource = this.handleEditResource.bind(this);
    this.handleUpdateResources = this.handleUpdateResources.bind(this);
    this.handleDeleteResource = this.handleDeleteResource.bind(this);
    this.handleNestedErrors = this.handleNestedErrors.bind(this);
    this.handleAddResourceClick = this.handleAddResourceClick.bind(this);
  }

  componentDidMount() {
    this.setState({ rlresources: this.props.resources });
  }

  handleNestedErrors(response) {
    this.props.onErrors(response);
    this.setState({anyErrors: true})
  }

  handleReturnClick(){
    this.props.onReturnTripPage();
  }

  handleAddResourceClick() {
    this.setState({addResourceForm: true})
    $("#resources-list").addClass('hidden')
    $("#add-resource-button").addClass("hidden")
  }

  handleAddNewResource(resources) {
    this.setState({rlresources: resources, addResourceForm: false, anyErrors: false})
    $("#resources-list").removeClass('hidden')
    $("#add-resource-button").removeClass("hidden")
  }

  handleUpdateResources(resources) {
    this.setState({
      rlresources: resources,
      editResourceForm: false,
      anyErrors: false
    });
    $("#resources-list").removeClass('hidden')
    $("#add-resource-button").removeClass("hidden")
  }

  handleEditResource(event) {
    event.preventDefault();
    let { rlist } = this.props;
    var resourceID = $(event.target).attr('href');
    $.ajax({
      url: "/trips/" + rlist.trip_id + "/resource_lists/" + rlist.id + "/resources/" + resourceID
    })
    .done(function(response) {
      this.setState({ editResourceForm: true,
                      resource: response
      });
      $("#resources-list").addClass('hidden')
      $("#add-resource-button").addClass("hidden")
    }.bind(this))
  }

    handleDeleteResource(event) {
      event.preventDefault();
      let { rlist } = this.props;
      var resourceID = $(event.target).attr('href');
      $.ajax({
        url: "/trips/" + rlist.trip_id + "/resource_lists/" + rlist.id + "/resources/" + resourceID,
        method: "delete"
      })
      .done(function(response) {
        this.setState({ rlresources: response})
      }.bind(this))
    }

  render(){
    let { name } = this.props.rlist;
    return(
      <div className="row">
        <div className="small-10 small-centered medium-8 medium centeredlarge-8 large-centered column">
        <h5 className="list-header">{name}</h5>
        <div id="add-resource-button">
          <button className="hollow button" onClick={this.handleAddResourceClick}>Add Resource</button>
        </div>
        <div id="add-errors">
          { this.state.anyErrors ? <AddErrors errors={this.props.errors}/> : null }
        </div>
        <div id="add-resource-form" >
          { this.state.addResourceForm ? <AddSingleResource resource_list={this.props.rlist} onAddNewResource={this.handleAddNewResource} onErrors={this.handleNestedErrors}/> : null }
        </div>
        <div id="edit-resource-form" >
          { this.state.editResourceForm ? <EditSingleResource resource_list={this.props.rlist} resource={this.state.resource} onUpdateResources={this.handleUpdateResources} onErrors={this.handleNestedErrors}/> : null }
        </div>
        <div id="resources-list">
          {this.state.rlresources.map((resource, i) =>
            <div key={i}>

              {resource.link === "" ? <p key={i}>{resource.name} <div className="user-options">
                <button className="fa fa-pencil-square-o" href={resource.id} type="button" value="Edit Resource" onClick={this.handleEditResource} ></button>
                <button className="fa fa-trash-o" href={resource.id} type="button" value="Delete Resource" onClick={this.handleDeleteResource}> </button>
              </div><br/><span className="resource-details">{resource.details}</span></p> : <p key={i}><a target="_blank" href={resource.link}> {resource.name} </a> <div className="user-options">
                <button className="fa fa-pencil-square-o" href={resource.id} type="button" value="Edit Resource" onClick={this.handleEditResource} ></button>
                <button className="fa fa-trash-o" href={resource.id} type="button" value="Delete Resource" onClick={this.handleDeleteResource}> </button>
              </div> <br/><span className="resource-details">{resource.details}</span></p>}

            </div>
          ) }
        </div>
        <button className="hollow button" onClick={this.handleReturnClick}>Return To Trip</button>
        </div>
      </div>
    )
  }
}
