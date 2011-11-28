class Bookmark < YouVersion::Resource

  attribute :highlight_color
  attribute :labels
  attribute :reference
  attribute :version
  attribute :title

  def user_id
    self.attributes['user_id']
  end

  def before_save
    unless self.reference.is_a?(String)
      self.reference = [self.reference].flatten.compact.map(&:osis).join("%2b")
    end
  end

  def after_save(response)
    Rails.logger.info "*"*80
    Rails.logger.info response
    Rails.logger.info "*"*80
    return unless response
    return
    # Sometimes references come back as an array, sometimes just one, Hashie::Mash
    osis = [response.reference].flatten.map(&:osis).join('+')
    self.reference = Reference.new("#{osis}.#{response.version}")
  end

  def after_build
    puts("I'm in after_build; thought you should know.")
    puts("self.reference is a #{self.reference.class}. Looks like [#{self.reference}].")
    case self.reference
    when Array
      self.references = self.reference.map { |n| Reference.new("#{n.osis.downcase}.#{self.version}") }
      self.reference = self.reference.map { |r| Reference.new("#{n.osis.downcase}.#{self.version}") }
    when String
      self.reference = [Reference.new("#{self.reference.downcase}.#{self.version}")]
    when Hashie::Mash
      self.reference = Reference.new("#{self.reference.osis.downcase}.#{self.version}")
    end
  end

  def update(fields)
    Rails.logger.info("==  Attempting merge #{fields} into #{self.attributes}")
    # In API version 2.3, only title, labels, and highlight_color can be updated
    allowed_keys = ['title', 'labels', 'highlight_color']

    # Clear out the ones we can't update.
    fields.delete_if {|k, v| ! allowed_keys.include? k}

    Rails.logger.info("==  Actual merge #{fields} into #{self.attributes}")
    super
  end

  # We have to override the default Resource version of this, because
  # the Bookmark API delete_path wants :ids instead of :id
  def self.destroy(id, auth = nil, &block)
    post(delete_path, {:ids => id, :auth => auth}, &block)
  end

  def self.all(params = {})
    params[:page] ||= 1

    data = all_raw(params) do |errors|
      Rails.logger.info "API Error: Bookmark.all(#{params}) got these errors: #{errors.inspect}"
      if errors.find{|g| g['error'] =~ /Bookmarks not found/}
        # return empty hash to avoid raising exception
        { }
      end
    end

    bookmarks = ResourceList.new
    if data['bookmarks']
      data.bookmarks.each do |b|
        bookmarks << Bookmark.new(b) if b.is_a? Hashie::Mash
      end
    end
    bookmarks.page = params[:page]
    bookmarks.total = data['total'].to_i if data['total']
    bookmarks
  end

  def self.for_label(label, params = {})
    page = params[:page] || 1
    opts = params.merge({label: label, page: page})

    data = all_raw(opts) do |errors|
      Rails.logger.info "API Error: Bookmark.for_label(#{label}) got these errors: #{errors.inspect}"
      if errors.find{|g| g['error'] =~ /Bookmarks not found/}
        # return empty hash to avoid raising exception
        { }
      end
    end

    bookmarks = ResourceList.new
    if data['bookmarks']
      data.bookmarks.each do |b|
        bookmarks << Bookmark.new(b) if b.is_a? Hashie::Mash
      end
    end
    bookmarks.page = opts[:page].to_i
    bookmarks.total = data['total'].to_i if data['total']
    bookmarks
  end

  def self.for_user(user_id = nil, params = {})
    page = params[:page] || 1
    opts = params.merge({user_id: user_id, page: page})

    data = all_raw(opts) do |errors|
      Rails.logger.info "API Error: Bookmark.for_user(#{user_id}) got these errors: #{errors.inspect}"
      if errors.find{|g| g['error'] =~ /Bookmarks not found/}
        # return empty hash to avoid raising exception
        { }
      end
    end

    bookmarks = ResourceList.new
    if data['bookmarks']
      data.bookmarks.each do |b|
        bookmarks << Bookmark.new(b) if b.is_a? Hashie::Mash
      end
    end
    bookmarks.page = opts[:page].to_i
    bookmarks.total = data['total'].to_i if data['total']
    bookmarks
  end

  # Yeah, bite me
  def created_as_date
    Date.parse(attributes['created'])
  end
end
