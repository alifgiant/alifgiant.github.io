---
title: "Customize Terminal on Mac"
date: "2020-09-15"
tags: ["Tech"]
featured: false
description: "Siapa yang bosan dengan tampilan hitam putih dari default terminal? Ingin bisa punya terminal asik gini? Colourful, Practical dan pastinya Geeky? Image/asset..."
readTime: "2 min"
image: "/assets/images/placeholder-blog.jpg"
---

Siapa yang bosan dengan tampilan hitam putih dari default terminal? Ingin bisa punya terminal asik gini? *Colourful, Practical* dan pastinya *Geeky*?

![Image](/assets/images/blog/e0271416-3597-46a7-82bc-3c98cf2062ca-1.png)

Kita bisa melakukannya dengan Zsh, Oh My Zsh dan iTerm2. Artikel kali ini akan memberikan step by step untuk mendapatkan tampilan yang sama. Lets, begin..

**1. Install Homebrew**

/usr/bin/ruby -e '$(curl -fsSL [https://raw.githubusercontent.com/Homebrew/install/master/install](https://raw.githubusercontent.com/Homebrew/install/master/install))'

**2. Install Zsh**

brew install zsh

**3. Set Zsh as Default Shell**

sudo sh -c "echo $(which zsh) >> /etc/shells" && chsh -s $(which zsh)

**4. Install Oh My Zsh**

sh -c "$(curl -fsSL [https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh](https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh))"

**5. Install Plugins**

git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting

**6. Add Plugins**

# edit config file $> nano ~/.zshrc  # set theme ZSH_THEME="agnoster"  # add plugins plugins=(git colored-man-pages colorize pip python brew osx zsh-syntax-highlighting zsh-autosuggestions)  # reload $> source ~/.zshrc

**7. Install Powerline Fonts**

# clone git clone https://github.com/powerline/fonts.git --depth=1 # install cd fonts ./install.sh # clean-up a bit cd .. rm -rf fonts

**7. Install iTerm2**

brew cask install iterm2

**8. Add customization**

# 1. download color scheme https://github.com/mbadolato/iTerm2-Color-Schemes) # 2. Import color mode Open iTerm2 > Preferences > Profiles > Colors > Colors Presets... > Import # 3. Change font Open iTerm2 > Preferences > Profiles > Text > Font > Select Any font with "Mono" and "Powerline" in its name

**9. Make default terminal**

Open iTerm2 > Default Menu (iTerm) > Make iTerm2 default Term

**10. Update VS Code terminal**

# 4. Change font Open Vs Code > Settings > Search "Font" > Scroll untill found "Terminal>Integrated: Font Family" > Type your selected font (i.e 'Roboto Mono Light for Powerline') with single quote mark

**11. Update old terminal**

# Change font Open Terminal > Preferences > Profiles > Select your default profile > Text > Select Any font with "Mono" and "Powerline" in its name

**12. Have fun and look cool 😎**

![Image](/assets/images/blog/e0271416-3597-46a7-82bc-3c98cf2062ca-2.png)

source:

[1] [https://gist.github.com/derhuerst/12a1558a4b408b3b2b6e](https://gist.github.com/derhuerst/12a1558a4b408b3b2b6e)

[2] [https://sourabhbajaj.com/mac-setup/iTerm/zsh.html](https://sourabhbajaj.com/mac-setup/iTerm/zsh.html)

[3] [https://gist.github.com/dogrocker/1efb8fd9427779c827058f873b94df95](https://gist.github.com/dogrocker/1efb8fd9427779c827058f873b94df95)
