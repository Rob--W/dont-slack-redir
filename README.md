# Don't slack-redir links

https://addons.mozilla.org/addon/dont-slack-redir/

Extension to prevent Slack from replacing external links with "slack-redir.net",
and prevent referrer leakage, so that your Slack URL does not end up in the
access logs of the linked website.

This extension aims to do that in the most efficient way possible. There are
other extensions with similar functionality, but they either work by responding
to changes in the whole document (using `MutationObserver`, which is costly) or
by fixing up links upon click (which may fail if the extension runs too early).

None of the extension that I reviewed had precautions against referrer leakage.
Since Slack hides the referrer by default, this shouldn't be a problem. But an
admin can change this ( https://slack.com/intl/en-gb/help/articles/204399413 ),
which results in unwanted referrer leakage.
