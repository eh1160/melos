class TwitterConnection < YouVersion::Connection::Base
  attribute :credentials
  attribute :uid
  attribute :info

  attribute :connection_type
  attribute :connection_user_id
  attribute :data

  TYPE = "tw"

  def before_save
    self.connection_type = TYPE
    self.connection_user_id = self.uid
    self.data = {
            oauth_token:        self.credentials["token"],
            oauth_token_secret: self.credentials["secret"],
            user_id:            self.uid,
            screen_name:        self.info["nickname"],
            key:                Cfg.twitter_key,
            secret:             Cfg.twitter_secret
           }.to_json
  end

  def find_friends(opts = {})
    opts = {connection_type: TYPE }.merge(opts)
    response = friends.ids.json? user_id: self.data[:user_id], cursor: -1
    users = []
    responses = response.ids.each_slice(25).to_a
    responses.each do |s|
      opts[:connection_user_ids] = s
      response = YvApi.post('users/find_connection_friends', opts) do |errors|
        []
      end
      response.each { |u| users << User.new(u) }
    end
    users
  end

  def delete
    result = YvApi.post("users/delete_connection", connection_type: TYPE, auth: auth)
    return result.twitter.nil?
  end

  def nickname
    '@' + data.screen_name
  end

  private

  def client
    @client ||= Grackle::Client.new(
      auth: {
        type:             :oauth,
        consumer_key:     data[:key],
        consumer_secret:  data[:secret],
        token:            data[:oauth_token],
        token_secret:     data[:oauth_token_secret]
      })
  end

  def friends
    client.friends
  end
end

