window.Moments ?= {}

class window.Moments.ReadingPlanCarousel extends window.Moments.Base

  constructor: (@data, @feed)->
    @template = JST["moments/reading_plan_carousel"]
    @feed.ready(@)

  render: ()->
    if @template

      html = @template
        kind:             @data.kind
        # uuid:           @generateID()
        # created_dt:     moment(@data.created_dt).format('LL')
        # moment_title:   @data.moment_title
        # body_text:      @data.body_text
        # body_image:     @data.body_image
        # avatar:         @data.avatar
        # avatar_style:   @data.avatar_style
        # action_url:     @data.action_url
        # kind_color:     @data.kind_color

      return html