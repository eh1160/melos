require 'spec_helper'

describe User do
#  use_vcr_cassette "user"
  before :all do
    @test_creds = {username: "testuser#{rand(10000)}", password: 'tenders'}
    @test_user = ensure_user @test_creds
    @auth = @test_user.auth
    @test_creds[:username]
  end

#   describe "#attributes" do
#     before :each do
#       @fake_user = User.new({alpha: "foo", beta: "bar", gamma: "baz"})
#     end
#
#     it "hashifies all the instance variables without an argument" do
#       all_attrs = @fake_user.attributes
#       all_attrs[:alpha].should == "foo"
#       all_attrs[:beta].should == "bar"
#       all_attrs[:gamma].should == "baz"
#     end
#
#     it "hashifies a few instance variables from passed symbols" do
#       @fake_user.attributes(:alpha, :beta).should == {alpha: "foo", beta: "bar"}
#     end
#   end

  describe ".authenticate" do
    it "returns a User mash for correct username and password" do
      User.authenticate(@test_creds[:username], @test_creds[:password]).username.should == @test_creds[:username]
    end

    it "returns nil for an incorrect username and password" do
      User.authenticate(@test_creds[:username], "asdf").should be_false
    end
  end

  describe ".register" do
    it "returns true for creating a user with valid params" do
      User.authenticate("testuser999", @test_creds[:password]).should be_false
      result = User.register(email: "testuser999@youversion.com", username: "testuser999", password: @test_creds[:password], agree: true, verified: true)
      result.should be_true
    end

    it "returns false for invalid params" do
      bad_user = User.register({email: "blah@stuff.com"})
      bad_user.should_not === true
    end
  end

  describe ".find" do
    it "finds a user by their id" do
      auth = nil
      friend = User.find(@testuser.id)
      friend.username.should == @test_creds[:username]

      auth = Hashie::Mash.new({user_id: @testuser.id, username: @test_creds[:username], password: @test_creds[:password]})
      User.find(auth).email.should == "testuser@youversion.com"

    end

    it "finds a user by their username" do
    end

    it "finds the current user" do

    end
  end

  describe "#recent_activity" do
    it "returns objects created by the user" do
      Bookmark.new(reference: "gen.1.1.asv", title: "community bookmark", auth: @auth).save.should be_true
      Note.new(reference: "gen.1.1.asv", title: "community note", content: "note", auth: @auth).save.should be_true
      re_act = @testuser.recent_activity
      re_act.each { |a| a.class.should be_in [Note, User, Bookmark]  }
    end
  end

  describe "#update_avatar" do
    # TODO: Seems wonky; am I breaking the API?
  end

end
