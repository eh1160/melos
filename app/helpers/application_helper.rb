module ApplicationHelper
  
  def object_status   #TODO: More useful name?
    status = {}
    status['Public'] = 'public'
    status['Private'] = 'private'
    status['Draft'] = 'draft'
    status
  end

  def truncate_words(text, length = 30, truncate_string = "...")
    return if text.empty?
    l = length - truncate_string.length
    text.length > length ? text[/\A.{#{l}}\w*\;?/m][/.*[\w\;]/m] + truncate_string : text
  end 

  def bible_path(ref = nil, opts={})
    ref = last_read || Reference.new(book: "gen", chapter: "1", version: current_version) if ref.nil?
    reference_path(ref.osis, opts)
  end
  
  def bible_url(ref = nil, opts={})
    ref = last_read || Reference.new(book: "gen", chapter: "1", version: current_version) if ref.nil?
    reference_url(ref.osis, opts)
  end
  
  def convert_to_brightness_value(hex_color)
      (hex_color.scan(/../).map {|color| color.hex}).sum
  end
  
  def report_exception(exception)
      #This is only necessarry in the case of an exception handled by rescue_from, as they are swallowed.
      #This may not be needed in the future if Exceptional adds support for the rescue_from.
      if Exceptional::Remote.error(Exceptional::ExceptionData.new(exception))
        Rails.logger.info "Exceptional: #{exception.class} has been reported to Exceptional"
      else
        Rails.logger.error "Exceptional: Problem sending exception. Check your API key."
      end
  end

  def is_dark?(hex_color)
    convert_to_brightness_value(hex_color) <= 382.5 #halfway between black (0+0+0 = 0) and white (255+255+255 = 765)
  end
end
