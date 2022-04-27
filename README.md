## mint机器人使用指南
1、不放心的可以先在测试网测试

测试水领取地址 https://faucets.chain.link/rinkeby

2、进入项目先安装依赖

``` npm install ```

3、配置机器人，需要配置的地方主要是这块，按照指示完成填写就行

![image](https://user-images.githubusercontent.com/5353946/165551178-d2863367-8295-47f5-9c5f-153b957eef93.png)


4、依赖和配置完成后，等到公售开启就能执行，执行代码

``` npm run start ```

这里提供了测试合约供大家测试

5、合约地址：0x8960DFF56962D8F9409e44d3Cb15dd1FD3749915

部署在rinkeby

etherscan rinkeby 地址 https://rinkeby.etherscan.io/address/0x8960dff56962d8f9409e44d3cb15dd1fd3749915

price: 0.06e

mint16进制编码: 0x1249c58b

16进制这块不懂的可以参考 NFT黑魔法教程
https://youtu.be/vq5fjkUGFZI

## 待实现功能

- [x] 1、自动触发mint，目前运行就会执行，需要一个事件触发例如时间或者特定事件，不是每个合约都会触发事件，有些是设置了定时，这块有想法的朋友也可以提出一些建议，看看能不能实现。比较简单的就是脚本设置定时 

- [ ] 2、...
