class NotesController < ApplicationController
  before_filter :set_nav

  def index
    if params[:user_id]
      @notes = User.find(params[:user_id].to_i, :auth => current_auth).notes
    else
      @notes = Note.all
    end
  end

  def show
    @note = Note.find(params[:id], :auth => current_auth)
    raise ActionController::RoutingError.new('Not Found') unless @note
  end

  def new
    if current_auth
      @note = Note.new
    else
      redirect_to notes_path
    end
  end

  def edit
    if current_auth
      @note = Note.find(params[:id], :auth => current_auth)
      @note.reference = @note.reference.osis_noversion
    else
      redirect_to notes_path
    end
  end

  def create
    @note = Note.new(params[:note])
    @note.auth = current_auth

    if @note.save
      render action: "show"
    else
      render action: "new"
    end
  end

  def update
    @note = Note.find(params[:id], :auth => current_auth)

    if @note.update(params[:note])
      render action: "show"
    else
      render action: "edit"
    end
  end

  def destroy
    @note = Note.find(params[:id], :auth => current_auth)

    if @note.destroy
      redirect_to notes_path
    else
      render action: "index"
    end
  end

  private

  def set_nav
    @nav = :notes
  end
end
