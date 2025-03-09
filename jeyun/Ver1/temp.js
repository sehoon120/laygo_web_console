with T(stockname, purchace_price, quantity) as 
(SELECT own.stockname as stockname, purchace_price, quantity FROM user join own on user.username = own.username WHERE user.username = 'jypark' and quantity > 0), 
S(stockname, prev_close) as 
(SELECT stockname, price as prev_close FROM history WHERE (stockname, date*100000000+time) in (SELECT stockname, max(date*100000000+time) FROM history WHERE date != 20241111 group by stockname))
SELECT stock.stockname as stockname, purchace_price, quantity, cur_price, prev_close FROM (T join stock on T.stockname=stock.stockname) join S on stock.stockname = S.stockname;

with T(stockname, purchace_price, quantity) as 
(SELECT own.stockname as stockname, purchace_price, quantity FROM user join own on user.username = own.username WHERE user.username = 'jypark' and quantity > 0), 
S(stockname, prev_close) as 
(SELECT stockname, price as prev_close FROM history WHERE (stockname, date*100000000+time) in (SELECT stockname, max(date*100000000+time) FROM history WHERE date != 20241111 group by stockname))
R(orderQ, stockname) as (SELECT sum(quantity) as orderQ, stockname FROM stockorder WHERE username = 'jypark' and stockname = 'Bandai')
SELECT stock.stockname as stockname, purchace_price, quantity, cur_price, prev_close FROM ((T join stock on T.stockname=stock.stockname) join S on stock.stockname = S.stockname) natural left outer join R using (stockname)