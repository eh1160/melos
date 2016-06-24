class EventsController < ApplicationController
  layout 'node_app'

  def show
    p = {
        "id" => params[:id],
        "strings" => {}
    }

    fromNode = YV::Nodestack::Fetcher.get('SingleEvent', p, cookies, current_auth, current_user)

    if (fromNode['error'].present?)
      return render_404
    end

    @title = fromNode['head']['title']

    render locals: { html: fromNode['html'], js: fromNode['js'] }
  end


  @locale = I18n.locale


end
