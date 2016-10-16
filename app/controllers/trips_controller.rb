class TripsController < ApplicationController
  def new
    @trip = Trip.new
    render "trips/_form", layout: false
  end

  def show
    @trip = Trip.find(params[:id]).as_json
    @packing_lists = Trip.find(params[:id]).packing_lists.as_json
    @resource_lists = Trip.find(params[:id]).resource_lists.as_json
    @itinerary = Trip.find(params[:id]).itinerary.as_json
  end

  def create
    @user = current_user
    @trip = @user.trips.new(trip_params)
    if @trip.save
      Itinerary.create(trip_id: @trip.id)
      flash[:success] = "Trip Added!"
      redirect_to @trip
    else
      render "/users/show"
    end
  end

  private
    def trip_params
      params.require(:trip).permit(:city, :country, :start_date, :end_date)
    end
end
