class AddPackingListForm extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    var url = "/trips/" + this.props.data.trip.id + "/packing_lists";
    var name = this.refs.nameBox.value;
    var trip_id = this.props.data.trip.id
    var list = { name, trip_id };
    var data = { list };
    $.ajax({
      url: url,
      method: "post",
      data: data
    })
    .done(function(response) {
      this.props.onListSubmit(response);
      $(".list-form").trigger("reset");
    }.bind(this))
    .fail(function(response) {
      this.props.onListSubmitErrors(response.responseJSON.name);
    }.bind(this))
  }

  render() {
    return(
      <div>
        <form className="list-form" ref="listForm"  onSubmit={this.handleSubmit}>
          <input type="text" ref="nameBox" name="list[name]" placeholder="Name" />
          <input type="submit" value="Submit"/>
        </form>
      </div>
  )}
}
