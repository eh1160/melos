class NotificationSettings < YouVersion::Resource

  attribute :notification_settings
  attribute :token

  attr_accessor :badges
  attr_accessor :follower
  attr_accessor :newsletter
  attr_accessor :note_like
  attr_accessor :reading_plans

  def self.resource_path
    "users/view_notification_settings"
  end

  def self.update_path
    "users/update_notification_settings"
  end

  def self.create_path
    "users/update_notification_settings"
  end

  def self.find(opts = {})
    super(nil, opts)
  end

  def persist_token
    nil
  end

  def persisted?
    true
  end


  def after_build
    notification_settings.each { |k, v| self.send("#{k}=".to_sym, v["email"]) }
    @attributes[:token] = nil
  end


  def before_save
    nts = ["badges", "follower", "newsletter", "note_like", "reading_plans"]
    hash = {}
    self.token = nil
    nts.each { |a| hash[a] = {"email" => self.send(a.to_sym).to_i == 1} }
    @attributes['notification_settings'] = hash
  end

end
