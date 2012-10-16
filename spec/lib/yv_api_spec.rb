require File.dirname(__FILE__) + '/../spec_helper'
require 'yv_api'
require 'benchmark'

describe YvApi do
  describe ".get" do
    it "gets a KJV booklist" do
      list = YvApi.get("bible/books", version: "kjv")
      list[0].human.should == "Genesis"
    end


    it "raises an informative exception if an API call fails" do
      lambda do
        YvApi.get("bible/books", version: "kjvff")
      end.should raise_error(RuntimeError, "API Error: Version is invalid")
    end

    it "uses a block to recover from an API error if it exists" do
      list = YvApi.get("bible/books", version: "kjvff2") do | e |
        e[0]["error"].should == "Version is invalid"
        YvApi.get("bible/books", version: "kjv")
      end
      list.first.human.should == "Genesis"
    end
  end

  describe ".post" do
    it "posts to the API" do
      lambda do
        YvApi.post("users/authenticate", auth_username: "asdf", auth_password: "ghjkl")
      end.should raise_error(RuntimeError, "API Error: Username or password is invalid")
    end
  end
end
