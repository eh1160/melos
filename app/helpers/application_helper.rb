module ApplicationHelper

  def available_locales
    @available_locales ||= I18n.available_locales
  end

  def current_locale
    @current_locale ||= I18n.locale
  end


  def localized_bible_icon
    # the following localizations have a 50x50 or slightly larger
    # asset localized. Add a new code here if you have
    # added the image asset as named below
    if [:km, :af, :ar, :nl, :en, :tl, :fi, :fr, :de, :hu,
        :ko, :ms, :no, :pl, :"pt-BR", :"pt-PT", :ro, :ru,
        :"zh-CN", :sk, :es, :sv, :"zh-TW", :uk, :bg, :ca,
        :"en-GB", :"es-ES", :hi, :id, :it, :ja, :mk, :mn,
        :sq, :tr, :vi, :cs, :da].include? I18n.locale
      "Bible-app-icon-#{I18n.locale}-small.png"
    else
      "Bible-app-icon-en-small.png"
    end
  end

  def overwrite_content_for(name, content = nil, &block)
    @view_flow.set(name, ActiveSupport::SafeBuffer.new)
    content_for(name, content, &block)
  end

  def html_attributes( atts = {} )
    classes = [atts[:classes]] if atts[:classes].is_a? String
    @html_id      = atts[:id] if atts[:id]
    @html_classes = classes if classes
  end

  def object_status   #TODO: More useful name?
    status = {}
    status[t('notes.public')] = 'public'
    status[t('notes.private')] = 'private'
    status[t('notes.draft')] = 'draft'
    status
  end

  def truncate_words(text, length = 30, truncate_string = "...")
    return if text.empty?
    l = length - truncate_string.length
    text.length > length ? text[/\A.{#{l}}\w*\;?/m][/.*[\w\;]/m] + truncate_string : text
  end

  def ref_url(usfm,version)
    "/bible/#{version}/#{usfm.downcase}"
  end


  def bible_path(ref=nil, opts={})
    ref = last_read || default_reference if ref.nil?
    ver = opts[:version_id] || opts[:version] || ref.version
    reference_path(ver, ref, opts)
  end

  def bible_url(ref=nil, opts={})
    ref = last_read || default_reference if ref.nil?
    ver = opts[:version_id] || opts[:version] || ref.version
    reference_url(ver, ref, opts)
  end

  def ref_from_params
    case
    when params.has_key?(:version)
      Reference.new(params[:reference], version: params[:version])
    else
      Reference.new(params[:reference])
    end
  end

  def default_reference
    Reference.new(book: "JHN", chapter: "1", version: current_version) rescue Reference.new('JHN.1', version: @site.default_version)
  end

  def external_url(host, default_locale_path='', locale_paths={})
    host_str = case host
      when :blog
        'http://blog.youversion.com'
      when :support
        'http://support.youversion.com'
      when :now
        'http://now.youversion.com'
      else
        host
    end

    path = case
      when locale_paths[I18n.locale]
        locale_paths[I18n.locale]
      when I18n.locale != I18n.default_locale && locale_paths[:default]
        locale_paths[:default]
      else
        default_locale_path
    end

    path.insert(0, '/') unless path.to_s == ''

    query_param = false
    lang_code_str = case host
      when :support
        query_param = true
        delim = path.include?('?') ? '&' : '?'
        "#{delim}lang=#{lang_code(I18n.locale, host)}"
      when :now
        "##{lang_code(I18n.locale, host)}"
      else
        lang_code(I18n.locale, host)
    end

    return "#{host_str}#{path}" if I18n.locale == I18n.default_locale
    return "#{host_str}#{path}#{lang_code_str}" if query_param
    return "#{host_str}/#{lang_code_str}#{path}"
  end

  def convert_to_brightness_value(hex_color)
      (hex_color.scan(/../).map {|color| color.hex}).sum
  end

  def bdc_user?
    @site.class == SiteConfigs::Bible rescue false
  end

  def is_dark?(hex_color)
    convert_to_brightness_value(hex_color) <= 382.5 #halfway between black (0+0+0 = 0) and white (255+255+255 = 765)
  end

  def scale_frame(html, opts={})
    h_w = html.scan(/<iframe width=\"(\d+)\" height=\"(\d+)\"/).flatten
    unless h_w.empty?
      ratio = 1
      if opts[:width]
        ratio = opts[:width].to_f/h_w[0].to_f
      end
      scaled_w = (h_w[0].to_f * ratio).to_i
      scaled_h = (h_w[1].to_f * ratio).to_i

      html = html.gsub(/<iframe width=\"\d+\" height=\"\d+\"/, '<iframe width="' + scaled_w.to_s + '" height="' + scaled_h.to_s + '"')
    end
    html
  end

  def a_very_short_time
    Cfg.very_short_cache_expiration.to_f.minutes
  end

  def a_short_time
    Cfg.short_cache_expiration.to_f.minutes
  end

  def a_long_time
    Cfg.long_cache_expiration.to_f.minutes
  end

  def a_very_long_time
    Cfg.very_long_cache_expiration.to_f.minutes
  end

  private
  def lang_code(locale, host=nil)
    case host
      when :blog
        {:'zh-CN' => 'zh-hans', :'zh-TW' => 'zh-hant', :'pt-BR' => 'pt-br'}[locale] || locale
      when :support, :generic_i18n
        locale.to_s.gsub('pt-BR', 'pt').gsub('-','_')
      when :now
        locale.to_s.gsub('pt-BR', 'pt')
      else
        locale
    end
  end
end
