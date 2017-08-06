# -*- coding: utf-8 -*-

"""
Apache Web 服务器日志

客户端IP地址： 如果客户端通过代理请求资源， 这个值可能是代理IP
客户标示： 通常不可靠， 往往不会记录
认证用户名： 无则不记录
请求接受时间： 包括日期、时间和时区
请求内容： 进一步细分为四个部分： 方法、资源请求参数和协议
状态码： HTTP 状态码
返回对象的大小： 以字节为单位
提交方（Referrer）: 通常是连接到Web 页面或资源的URI 或URL
用户代理： 客户端程序， 访问页面的程序或设备



10.1.1.95 - e800 [18/Mar/2005:12:21:42 +0800]
"GET /stats/awstats.pl?config=e800 HTTP/1.1" 200
899 "http://10.1.1.1/pv/" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; Maxthon)"
"""

import re
import fileinput
_lineRegex = re.compile(
r'(\d+\. \d+\. \d+\. \d+) ([^ ]*) ([^ ]*) [([^\]]*)\] "([^"]*)" ([^ ]*) "([^"])" "([^"])"')


class ApacheLogRecord(object):

    def __init__(self, *rgroups):
        self.ip, self.ident, \
           self.http_user, self.time \
           self.request_line, self.http_response_code, \
           self.http_response_size, self.referrer, self.user_agent = rgroups
        self.http_method, self.url, self.http_vers = self.request_line.split()

    def __str__(self):
        return ' '.join([self.ip, self.ident, self.time, self.request_line,
                        self.http_response_code, self.http_response_size,
                        self.referrer, self.user_agent])


class ApacheLogFile(object):

    def __init__(self, *filename):
        self.f = fileinput.input(filename)

    def close(self):
        self.f.close()

    def __iter__(self):
        match = _lineRegex.match
        for line in self.f:
            m = match(line)
            if m:
                try:
                    log_line = ApacheLogRecord(*m.groups())
                    yield log_line
                except GeneratorExit:
                    pass
                except Exception as e:
                    print('NON_COMPLIANT_FORMAAT: ', line, 'Exception: ', e)
